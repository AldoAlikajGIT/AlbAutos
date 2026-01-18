package albcars.project.services;

import albcars.project.DTO.AdminUserDTO;
import albcars.project.entities.User;
import albcars.project.repositories.UserRepository;
import albcars.project.securityConfig.CryptoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CryptoService cryptoService;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean verifyPassword(String rawPassword, String hashedPassword) {
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public boolean userExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /** Keep dumb: saves what it's given (no crypto) */
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public User registerUser(User user) {
        if (user == null) throw new IllegalArgumentException("User payload is required.");
        if (user.getEmail() == null || user.getEmail().isBlank()) throw new IllegalArgumentException("Email is required.");
        if (user.getPassword() == null || user.getPassword().isBlank()) throw new IllegalArgumentException("Password is required.");
        if (user.getFullName() == null || user.getFullName().isBlank()) throw new IllegalArgumentException("Full name is required.");
        if (user.getPhoneNumber() == null || user.getPhoneNumber().isBlank()) throw new IllegalArgumentException("Phone number is required.");

        user.setEmail(user.getEmail()); // entity normalizes

        String normalizedFullName = user.getFullName().trim();
        String normalizedPhone = user.getPhoneNumber().trim();

        String phoneHash = cryptoService.hmac(normalizedPhone);
        if (userRepository.existsByPhoneNumberHash(phoneHash)) {
            throw new IllegalArgumentException("Phone number already registered.");
        }

        user.setFullName(cryptoService.encrypt(normalizedFullName));
        user.setPhoneNumber(cryptoService.encrypt(normalizedPhone));
        user.setPhoneNumberHash(phoneHash);

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        try {
            return userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            throw e;
        }
    }

    public void updateContactInfo(String currentEmail, String newEmail, String newPhone) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        if (newEmail == null || newEmail.isBlank()) throw new IllegalArgumentException("Email is required.");
        if (newPhone == null || newPhone.isBlank()) throw new IllegalArgumentException("Phone number is required.");

        String normalizedNewEmail = newEmail.trim().toLowerCase();
        if (!normalizedNewEmail.equals(currentEmail) && userRepository.findByEmail(normalizedNewEmail).isPresent()) {
            throw new IllegalArgumentException("This email is already in use.");
        }

        String normalizedPhone = newPhone.trim();
        String newPhoneHash = cryptoService.hmac(normalizedPhone);

        String currentHash = user.getPhoneNumberHash();
        if (currentHash == null || !currentHash.equals(newPhoneHash)) {
            if (userRepository.existsByPhoneNumberHash(newPhoneHash)) {
                throw new IllegalArgumentException("This phone number is already in use.");
            }
        }

        user.setEmail(normalizedNewEmail);
        user.setPhoneNumberHash(newPhoneHash);
        user.setPhoneNumber(cryptoService.encrypt(normalizedPhone));

        userRepository.save(user);
    }

    // ----------------------------
    // Admin-focused methods
    // ----------------------------

    /** Return users as decrypted DTOs for the admin dashboard */
    public List<AdminUserDTO> getAllUsersForAdmin() {
        return userRepository.findAll().stream().map(u -> {
            String fullName = safeDecrypt(u.getFullName());
            String phone = safeDecrypt(u.getPhoneNumber());
            return new AdminUserDTO(
                    u.getId(),
                    u.getEmail(),
                    fullName,
                    phone,
                    u.getRole() != null ? u.getRole().name() : "USER",
                    u.isActive()
            );
        }).toList();
    }

    public AdminUserDTO getUserForAdminByEmail(String email) {
        String normalized = email == null ? "" : email.trim().toLowerCase();
        User u = userRepository.findByEmail(normalized)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        return new AdminUserDTO(
                u.getId(),
                u.getEmail(),
                safeDecrypt(u.getFullName()),
                safeDecrypt(u.getPhoneNumber()),
                u.getRole() != null ? u.getRole().name() : "USER",
                u.isActive()
        );
    }

    public void setUserActiveByEmail(String email, boolean active) {
        String normalized = email == null ? "" : email.trim().toLowerCase();
        User u = userRepository.findByEmail(normalized)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        u.setActive(active);
        userRepository.save(u);
    }

    /** Admin update (decrypt in response is handled by DTO endpoints) */
    public void adminUpdateUserContactByEmail(String email, String newFullName, String newPhone) {
        String normalized = email == null ? "" : email.trim().toLowerCase();
        User u = userRepository.findByEmail(normalized)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        if (newFullName != null && !newFullName.isBlank()) {
            u.setFullName(cryptoService.encrypt(newFullName.trim()));
        }

        if (newPhone != null && !newPhone.isBlank()) {
            String normalizedPhone = newPhone.trim();
            String newHash = cryptoService.hmac(normalizedPhone);

            String currentHash = u.getPhoneNumberHash();
            if (currentHash == null || !currentHash.equals(newHash)) {
                if (userRepository.existsByPhoneNumberHash(newHash)) {
                    throw new IllegalArgumentException("This phone number is already in use.");
                }
            }
            u.setPhoneNumberHash(newHash);
            u.setPhoneNumber(cryptoService.encrypt(normalizedPhone));
        }

        userRepository.save(u);
    }

    /** Deletes the user by email (ads deletion can be enforced separately) */
    public void deleteUserByEmail(String email) {
        String normalized = email == null ? "" : email.trim().toLowerCase();
        User u = userRepository.findByEmail(normalized)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        userRepository.delete(u);
    }

    private String safeDecrypt(String value) {
        if (value == null || value.isBlank()) return value;
        try {
            return cryptoService.decrypt(value);
        } catch (Exception e) {
            // If some legacy plaintext exists, don't crash admin list
            return value;
        }
    }
}
