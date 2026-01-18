package albcars.project.controllers;

import albcars.project.DTO.AdminUserDTO;
import albcars.project.DTO.CarAdDTO;
import albcars.project.DTO.JwtResponse;
import albcars.project.DTO.LoginRequest;
import albcars.project.entities.User;
import albcars.project.securityConfig.JwtUtil;
import albcars.project.services.CarAdService;
import albcars.project.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;
    private final CarAdService carAdService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    public AdminController(UserService userService, CarAdService carAdService) {
        this.userService = userService;
        this.carAdService = carAdService;
    }

    // -----------------------
    // Admin login
    // -----------------------
    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody LoginRequest loginRequest) {
        String email = loginRequest.getEmail() == null ? "" : loginRequest.getEmail().trim().toLowerCase();
        Optional<User> userOptional = userService.getUserByEmail(email);

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        User user = userOptional.get();
        if (user.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(403).body("Access denied: not an admin");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, loginRequest.getPassword())
            );
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        String token = jwtUtil.generateToken(email, "ROLE_ADMIN");
        return ResponseEntity.ok(new JwtResponse(token));
    }

    // -----------------------
    // Users (email-based)
    // -----------------------
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<List<AdminUserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsersForAdmin());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users/by-email")
    public ResponseEntity<?> getUserByEmail(@RequestParam String email) {
        try {
            return ResponseEntity.ok(userService.getUserForAdminByEmail(email));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(Map.of("code", "NOT_FOUND", "message", e.getMessage()));
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/users/ban")
    public ResponseEntity<?> banUserByEmail(@RequestParam String email) {
        userService.setUserActiveByEmail(email, false);
        return ResponseEntity.ok("User has been banned");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/users/unban")
    public ResponseEntity<?> unbanUserByEmail(@RequestParam String email) {
        userService.setUserActiveByEmail(email, true);
        return ResponseEntity.ok("User has been unbanned");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/users/by-email")
    public ResponseEntity<?> deleteUserByEmail(@RequestParam String email) {
        userService.deleteUserByEmail(email);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/users/by-email")
    public ResponseEntity<?> updateUserByEmail(
            @RequestParam String email,
            @RequestBody Map<String, String> updates
    ) {
        String newFullName = updates.get("fullName");
        String newPhone = updates.get("phoneNumber");

        try {
            userService.adminUpdateUserContactByEmail(email, newFullName, newPhone);
            return ResponseEntity.ok("User updated");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("code", "VALIDATION_ERROR", "message", e.getMessage()));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(409).body(Map.of("code", "DUPLICATE", "message", "Phone already in use"));
        }
    }

    // -----------------------
    // Ads (search by email, delete by id)
    // -----------------------
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/ads/by-user-email")
    public ResponseEntity<List<CarAdDTO>> getUserAdsByEmail(@RequestParam String email) {
        return ResponseEntity.ok(carAdService.getCarAdsByUserEmailAsDTO(email));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/ads/{adId}")
    public ResponseEntity<?> deleteAdById(@PathVariable Long adId) {
        carAdService.adminDeleteAdById(adId);
        return ResponseEntity.noContent().build();
    }
}
