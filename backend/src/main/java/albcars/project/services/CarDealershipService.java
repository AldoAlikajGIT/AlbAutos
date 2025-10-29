package albcars.project.services;

import albcars.project.entities.CarDealership;
import albcars.project.repositories.CarDealershipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CarDealershipService {

    private final CarDealershipRepository carDealershipRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    public CarDealershipService(CarDealershipRepository carDealershipRepository) {
        this.carDealershipRepository = carDealershipRepository;
    }

    public CarDealership registerDealership(CarDealership dealership) {
        if (carDealershipRepository.existsByEmail(dealership.getEmail())) {
            throw new IllegalArgumentException("Email is already in use.");
        }

        dealership.setPassword(passwordEncoder.encode(dealership.getPassword()));
        dealership.setRole("carDealership");

        dealership.setRole("carDealership"); // Assign default role
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
    public void updateContactInfo(String currentEmail, String newEmail, String newPhone) {
        CarDealership dealership = carDealershipRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new IllegalArgumentException("Dealership not found."));

        if (!newEmail.equals(currentEmail) &&
                carDealershipRepository.findByEmail(newEmail).isPresent()) {
            throw new IllegalArgumentException("This email is already in use.");
        }

        dealership.setEmail(newEmail);
        dealership.setPhoneNumber(newPhone);
        carDealershipRepository.save(dealership);
    }
}
