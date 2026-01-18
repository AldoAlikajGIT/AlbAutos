package albcars.project.services;

import albcars.project.entities.CarDealership;
import albcars.project.repositories.CarDealershipRepository;
import albcars.project.securityConfig.CryptoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CarDealershipService {

    private final CarDealershipRepository carDealershipRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CryptoService cryptoService;

    @Autowired
    public CarDealershipService(CarDealershipRepository carDealershipRepository) {
        this.carDealershipRepository = carDealershipRepository;
    }

    /**
     * Keep this method "dumb" to avoid double-encryption.
     * Only saves what it's given.
     */
    public CarDealership save(CarDealership dealership) {
        return carDealershipRepository.save(dealership);
    }

    public Optional<CarDealership> findById(Long id) {
        return carDealershipRepository.findById(id);
    }

    public boolean emailExists(String email) {
        return carDealershipRepository.existsByEmail(email);
    }

    public Optional<CarDealership> findByEmail(String email) {
        return carDealershipRepository.findByEmail(email);
    }

    /**
     * Registration flow:
     * - validates required fields
     * - email stays plaintext (normalized)
     * - phone: required, hashed for uniqueness + encrypted for storage
     * - vatNumber/businessName: encrypted for storage (required here)
     * - password: bcrypt
     */
    @Transactional
    public CarDealership registerDealership(CarDealership dealership) {
        if (dealership == null) {
            throw new IllegalArgumentException("Dealership payload is required.");
        }

        if (dealership.getEmail() == null || dealership.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required.");
        }
        if (dealership.getPassword() == null || dealership.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required.");
        }
        if (dealership.getPhoneNumber() == null || dealership.getPhoneNumber().isBlank()) {
            throw new IllegalArgumentException("Phone number is required.");
        }
        if (dealership.getBusinessName() == null || dealership.getBusinessName().isBlank()) {
            throw new IllegalArgumentException("Business name is required.");
        }
        if (dealership.getVatNumber() == null || dealership.getVatNumber().isBlank()) {
            throw new IllegalArgumentException("VAT number is required.");
        }

        // normalize email
        dealership.setEmail(dealership.getEmail().trim().toLowerCase());

        // normalize sensitive inputs
        String normalizedPhone = dealership.getPhoneNumber().trim();
        String normalizedBusinessName = dealership.getBusinessName().trim();
        String normalizedVat = dealership.getVatNumber().trim();

        // uniqueness by hash
        String phoneHash = cryptoService.hmac(normalizedPhone);
        if (carDealershipRepository.existsByPhoneNumberHash(phoneHash)) {
            throw new IllegalArgumentException("Phone number already registered.");
        }

        // encrypt + store
        dealership.setPhoneNumberHash(phoneHash);
        dealership.setPhoneNumber(cryptoService.encrypt(normalizedPhone));
        dealership.setBusinessName(cryptoService.encrypt(normalizedBusinessName));
        dealership.setVatNumber(cryptoService.encrypt(normalizedVat));

        // bcrypt + role
        dealership.setPassword(passwordEncoder.encode(dealership.getPassword()));
        dealership.setRole("carDealership");

        try {
            return carDealershipRepository.save(dealership);
        } catch (DataIntegrityViolationException e) {
            // fallback for race conditions on unique constraints
            throw e;
        }
    }

    /**
     * Update contact info:
     * - email plaintext normalized
     * - phone encrypted + hash uniqueness enforced
     */
    public void updateContactInfo(String currentEmail, String newEmail, String newPhone) {

        CarDealership dealership = carDealershipRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new IllegalArgumentException("Dealership not found."));

        if (newEmail == null || newEmail.isBlank()) {
            throw new IllegalArgumentException("Email is required.");
        }
        if (newPhone == null || newPhone.isBlank()) {
            throw new IllegalArgumentException("Phone number is required.");
        }

        String normalizedNewEmail = newEmail.trim().toLowerCase();
        if (!normalizedNewEmail.equals(currentEmail) &&
                carDealershipRepository.findByEmail(normalizedNewEmail).isPresent()) {
            throw new IllegalArgumentException("This email is already in use.");
        }

        String normalizedPhone = newPhone.trim();
        String newPhoneHash = cryptoService.hmac(normalizedPhone);

        String currentHash = dealership.getPhoneNumberHash();
        if (currentHash == null || !currentHash.equals(newPhoneHash)) {
            if (carDealershipRepository.existsByPhoneNumberHash(newPhoneHash)) {
                throw new IllegalArgumentException("This phone number is already in use.");
            }
        }

        dealership.setEmail(normalizedNewEmail);
        dealership.setPhoneNumberHash(newPhoneHash);
        dealership.setPhoneNumber(cryptoService.encrypt(normalizedPhone));

        carDealershipRepository.save(dealership);
    }
}
