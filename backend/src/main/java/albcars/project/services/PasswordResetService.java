package albcars.project.services;

import albcars.project.entities.PasswordResetToken;
import albcars.project.entities.User;
import albcars.project.repositories.PasswordResetTokenRepository;
import albcars.project.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Initiates password reset by deleting any existing tokens for the user,
     * generating a new one, saving it, and emailing the reset link.
     */
    @Transactional
    public void initiatePasswordReset(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) return;

        User user = userOptional.get();

        // ✅ Fix: delete & flush to prevent unique constraint violation
        passwordResetTokenRepository.deleteByUser(user);
        passwordResetTokenRepository.flush();

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(token, user, LocalDateTime.now().plusHours(1));
        passwordResetTokenRepository.save(resetToken);

        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        String subject = "Password Reset Request";
        String body = "Click the following link to reset your password:\n\n" + resetLink;

        System.out.println("🔐 Reset Link for user account: " + resetLink);
        emailService.sendEmail(user.getEmail(), subject, body);
    }

    /**
     * Resets password if the token is valid and not expired.
     */
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid token"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Token has expired");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        passwordResetTokenRepository.delete(resetToken);
    }
}
