package albcars.project.services;

import albcars.project.entities.User;
import albcars.project.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Autowired
    private PasswordEncoder passwordEncoder;

    public boolean verifyPassword(String rawPassword, String hashedPassword) {
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }


    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public boolean userExists(String email) { // ✅ Fix: Add this method
        return userRepository.findByEmail(email).isPresent();
    }

    public Optional<User> getUserByEmail(String email) { // ✅ Fix: Add this method
        return userRepository.findByEmail(email);
    }

    public User saveUser(User user) { // ✅ Fix: Ensure this method returns a User
        return userRepository.save(user);
    }
    public void updateContactInfo(String currentEmail, String newEmail, String newPhone) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        // Optional: prevent email collision
        if (!newEmail.equals(currentEmail) &&
                userRepository.findByEmail(newEmail).isPresent()) {
            throw new IllegalArgumentException("This email is already in use.");
        }

        user.setEmail(newEmail);
        user.setPhoneNumber(newPhone);
        userRepository.save(user);
    }

}
