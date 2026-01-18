package albcars.project.controllers;

import albcars.project.entities.CarDealership;
import albcars.project.entities.User;
import albcars.project.securityConfig.CryptoService;
import albcars.project.securityConfig.RateLimitingService;
import albcars.project.repositories.CarDealershipPasswordResetTokenRepository;
import albcars.project.repositories.CarDealershipRepository;
import albcars.project.repositories.PasswordResetTokenRepository;
import albcars.project.repositories.UserRepository;
import albcars.project.securityConfig.JwtUtil;
import albcars.project.services.CarDealershipPasswordResetService;
import albcars.project.services.CarDealershipService;
import albcars.project.services.PasswordResetService;
import albcars.project.services.UserService;
import io.github.bucket4j.Bucket;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private PasswordResetService passwordResetService;

    @Autowired
    private CarDealershipService carDealershipService;

    @Autowired
    private CarDealershipPasswordResetService carDealershipPasswordResetService;

    @Autowired
    private CarDealershipRepository dealershipRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RateLimitingService rateLimitingService; // ✅ Inject RateLimitingService

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user, HttpServletRequest request) {
        System.out.println("api/auth/register hit");

        try {
            userService.registerUser(user);
            return ResponseEntity.ok("User registered successfully");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "code", "VALIDATION_ERROR",
                    "message", e.getMessage()
            ));

        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            e.printStackTrace(); // TEMP: show real DB constraint failure
            return ResponseEntity.status(409).body(Map.of(
                    "code", "DUPLICATE",
                    "message", "Email or phone already registered"
            ));

        } catch (Exception e) {
            e.printStackTrace(); // TEMP: show real reason for the 500
            return ResponseEntity.status(500).body(Map.of(
                    "code", "SERVER_ERROR",
                    "message", e.getMessage()
            ));
        }
    }


    @PostMapping("/dealerships/register")
    public ResponseEntity<?> registerCarDealership(@RequestBody CarDealership dealership, HttpServletRequest request) {
        String clientKey = "registerDealership:" + request.getRemoteAddr();
        Bucket bucket = rateLimitingService.resolveBucket(clientKey, 20, 86400);

        if (!bucket.tryConsume(1)) {
            return ResponseEntity.status(429).body("Too many registration attempts. Try again later.");
        }

        // normalize email early
        String email = dealership.getEmail() == null ? "" : dealership.getEmail().trim().toLowerCase();
        dealership.setEmail(email);

        if (dealershipRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(409).body(Map.of(
                    "code", "EMAIL_ALREADY_IN_USE",
                    "message", "Email already registered"
            ));
        }

        try {
            carDealershipService.registerDealership(dealership); // all crypto inside service
            return ResponseEntity.ok("Car dealership registered successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "code", "VALIDATION_ERROR",
                    "message", e.getMessage()
            ));
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            return ResponseEntity.status(409).body(Map.of(
                    "code", "DUPLICATE",
                    "message", "Email or phone already registered"
            ));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> credentials, HttpServletRequest request) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        String ip = request.getRemoteAddr();

        // ✅ Step 1: Check if email exists
        boolean emailExists = userService.userExists(email);

        Bucket bucket;

        if (emailExists) {
            // ✅ Step 2: Per-account rate limit (email-based)
            String clientKey = "loginAccount:" + email;
            bucket = rateLimitingService.resolveBucket(clientKey, 30, 3600); // 30 per hour per account
        } else {
            // ✅ Step 2: IP-based rate limit (for non-existing emails)
            String clientKey = "loginIP:" + ip;
            bucket = rateLimitingService.resolveBucket(clientKey, 20, 3600); // 20 per hour per IP
        }

        System.out.println("Tokens BEFORE consume for " + (emailExists ? email : ip) + ": " + bucket.getAvailableTokens());

        if (!bucket.tryConsume(1)) {
            return ResponseEntity.status(429).body("Too many login attempts. Try again later.");
        }

        // ✅ Step 3: Authenticate
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            User user = userService.getUserByEmail(email).get();
            String role = "ROLE_" + user.getRole().name();
            String token = jwtUtil.generateToken(email, role);

            return ResponseEntity.ok(Map.of("token", token));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Invalid email or password.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/dealerships/login")
    public ResponseEntity<?> loginCarDealership(@RequestBody Map<String, String> credentials, HttpServletRequest request) {

        String email = credentials.get("email");
        String password = credentials.get("password");

        // ✅ Check if email exists in DB
        boolean emailExists = dealershipRepository.findByEmail(email).isPresent();

        String clientKey;
        Bucket bucket;

        if (emailExists) {
            // ✅ Per-account limit (protect real dealership accounts)
            clientKey = "loginDealership:account:" + email;
            bucket = rateLimitingService.resolveBucket(clientKey, 30, 3600); // 30 attempts per hour per account
        } else {
            // ✅ IP-based limit (protect against random email spam)
            clientKey = "loginDealership:ip:" + request.getRemoteAddr();
            bucket = rateLimitingService.resolveBucket(clientKey, 20, 3600); // 20 attempts per hour per IP
        }

        System.out.println("Tokens BEFORE consume for " + clientKey + ": " + bucket.getAvailableTokens());

        if (!bucket.tryConsume(1)) {
            return ResponseEntity.status(429).body("Too many login attempts. Try again later.");
        }

        try {
            CarDealership dealership = dealershipRepository.findByEmail(email)
                    .orElse(null);

            if (dealership == null || !passwordEncoder.matches(password, dealership.getPassword())) {
                return ResponseEntity.status(401).body("Invalid email or password.");
            }

            String role = "ROLE_CARDEALERSHIP";
            String token = jwtUtil.generateToken(email, role);
            return ResponseEntity.ok(Map.of("token", token));

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> request,
                                                 HttpServletRequest servletRequest) {
        String email = request.get("email");
        String clientKey = "reset:" + servletRequest.getRemoteAddr();

        Bucket bucket = rateLimitingService.resolveBucket(clientKey, 2, 86400); /* 2 per day */
        System.out.println("Tokens BEFORE consume for " + clientKey + ": " + bucket.getAvailableTokens());

        // ✅ Consume token here, so only real password reset requests count
        if (!bucket.tryConsume(1)) {
            return ResponseEntity.status(429).body("Too many password reset attempts. Try again later.");
        }

        passwordResetService.initiatePasswordReset(email);
        return ResponseEntity.ok("If that email exists, a reset link has been sent.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        if (newPassword.length() < 12) {
            return ResponseEntity.badRequest().body("Password must be at least 12 characters long.");
        }

        try {
            passwordResetService.resetPassword(token, newPassword);
            return ResponseEntity.ok("Password has been reset successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/forgot-password-cardealership")
    public ResponseEntity<String> forgotPasswordForCarDealership(@RequestBody Map<String, String> request,
                                                                 HttpServletRequest servletRequest) {
        String email = request.get("email");
        String clientKey = "resetDealership:" + servletRequest.getRemoteAddr();

        Bucket bucket = rateLimitingService.resolveBucket(clientKey, 2, 86400); /* 2 per day */
        System.out.println("Tokens BEFORE consume for " + clientKey + ": " + bucket.getAvailableTokens());
        if (!bucket.tryConsume(1)) {
            return ResponseEntity.status(429).body("Too many password reset attempts. Try again later.");
        }
        carDealershipPasswordResetService.initiatePasswordReset(email);
        return ResponseEntity.ok("If that dealership email exists, a reset link has been sent.");
    }

    @PostMapping("/reset-password-cardealership")
    public ResponseEntity<String> resetPasswordForCarDealership(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        if (newPassword.length() < 12) {
            return ResponseEntity.badRequest().body("Password must be at least 12 characters long.");
        }

        try {
            carDealershipPasswordResetService.resetPassword(token, newPassword);
            return ResponseEntity.ok("Car dealership password has been reset successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
