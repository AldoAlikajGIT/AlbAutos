package albcars.project.services;

import albcars.project.entities.CarDealership;
import albcars.project.entities.CarDealershipPasswordResetToken;
import albcars.project.repositories.CarDealershipPasswordResetTokenRepository;
import albcars.project.repositories.CarDealershipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class CarDealershipPasswordResetService {

    @Autowired
    private CarDealershipPasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private CarDealershipRepository dealershipRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public void initiatePasswordReset(String email) {
        Optional<CarDealership> dealershipOpt = dealershipRepository.findByEmail(email);
        if (dealershipOpt.isEmpty()) return;

        CarDealership dealership = dealershipOpt.get();
        tokenRepository.deleteByCarDealership(dealership);
        tokenRepository.flush(); // ✅ Ensure deletion is committed before inserting

        String token = UUID.randomUUID().toString();
        CarDealershipPasswordResetToken resetToken = new CarDealershipPasswordResetToken();
        resetToken.setToken(token);
        resetToken.setCarDealership(dealership);
        resetToken.setExpiryDate(LocalDateTime.now().plusHours(1));
        tokenRepository.save(resetToken);

        String resetLink = "http://localhost:5173/reset-password-cardealership?token=" + token;

        String subject = "Car Dealership Password Reset Request";
        String body = "Click the following link to reset your dealership account password:\n\n" + resetLink;
        System.out.println("🔐 Reset Link for car dealership account: " + resetLink);
        emailService.sendEmail(dealership.getEmail(), subject, body);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        CarDealershipPasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid token"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Token has expired");
        }

        CarDealership dealership = resetToken.getCarDealership();
        String encodedPassword = passwordEncoder.encode(newPassword);
        dealership.setPassword(encodedPassword);
        dealershipRepository.save(dealership);

        System.out.println("🚗 Email: " + dealership.getEmail());
        System.out.println("🔑 Raw password: " + newPassword);
        System.out.println("🔐 Encoded in DB: " + dealership.getPassword());
        System.out.println("✅ Password match result: " + passwordEncoder.matches(newPassword, dealership.getPassword()));

        tokenRepository.delete(resetToken);
    }
}
