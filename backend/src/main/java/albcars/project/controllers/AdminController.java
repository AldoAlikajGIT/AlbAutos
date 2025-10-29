package albcars.project.controllers;

import albcars.project.DTO.JwtResponse;
import albcars.project.DTO.LoginRequest;
import albcars.project.entities.CarAd;
import albcars.project.entities.User;
import albcars.project.securityConfig.JwtUtil;
import albcars.project.services.CarAdService;
import albcars.project.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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

    /**
     * ✅ Admin login - returns JWT token if role is ADMIN
     */
    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOptional = userService.getUserByEmail(loginRequest.getEmail());

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        User user = userOptional.get();

        if (user.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(403).body("Access denied: not an admin");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return ResponseEntity.ok(new JwtResponse(token));
    }

    /**
     * ✅ Ban a user
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/ban/{userId}")
    public ResponseEntity<String> banUser(@PathVariable Long userId) {
        Optional<User> userOptional = userService.getUserById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = userOptional.get();
        user.setActive(false);
        userService.saveUser(user);

        return ResponseEntity.ok("User has been banned");
    }

    /**
     * ✅ Unban a user
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/unban/{userId}")
    public ResponseEntity<String> unbanUser(@PathVariable Long userId) {
        Optional<User> userOptional = userService.getUserById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = userOptional.get();
        user.setActive(true);
        userService.saveUser(user);

        return ResponseEntity.ok("User has been unbanned");
    }

    /**
     * ✅ View all users
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /**
     * ✅ View all car ads posted by a specific user
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/user-ads-by-email/{email:.+}")
    public ResponseEntity<?> getUserAdsByEmail(@PathVariable String email) {
        String normalized = email == null ? "" : email.trim().toLowerCase();
        Optional<User> userOpt = userService.getUserByEmail(normalized);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        List<CarAd> ads = carAdService.getCarAdsByUserId(userOpt.get().getId());
        if (ads.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(ads);
    }
}
