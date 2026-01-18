    package albcars.project.controllers;

    import albcars.project.securityConfig.JwtUtil;
    import albcars.project.entities.User;
    import albcars.project.services.UserService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.security.Principal;
    import java.util.Map;
    import java.util.Optional;

    @RestController
    @RequestMapping("/api/users")
    public class UserController {

        @Autowired
        private UserService userService;

        @Autowired
        private JwtUtil jwtUtil;

        @GetMapping("/{email}")
        public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
            return userService.getUserByEmail(email)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        }


        @GetMapping("/role-check")
        public ResponseEntity<?> getCurrentUserRole(org.springframework.security.core.Authentication authentication) {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body(Map.of("role", "ANONYMOUS"));
            }

            // Take the first ROLE_* authority (works for USER, ADMIN, CARDEALERSHIP, etc.)
            String role = authentication.getAuthorities().stream()
                    .map(org.springframework.security.core.GrantedAuthority::getAuthority) // e.g. ROLE_ADMIN
                    .filter(a -> a != null && a.startsWith("ROLE_"))
                    .findFirst()
                    .orElse("ANONYMOUS");

            // If you want to also return email, use authentication.getName()
            return ResponseEntity.ok(Map.of(
                    "email", authentication.getName(),
                    "role", role
            ));
        }


        @PatchMapping("/update-contact")
        public ResponseEntity<?> updateContactInfo(
                @RequestBody Map<String, String> updates,
                Principal principal
        ) {
            String currentEmail = principal.getName(); // Extracts current user from JWT
            String newEmail = updates.get("email");
            String newPhone = updates.get("phoneNumber");

            if (newEmail == null || newPhone == null) {
                return ResponseEntity.badRequest().body("Missing required fields: email or phoneNumber.");
            }

            try {
                userService.updateContactInfo(currentEmail, newEmail, newPhone);
                return ResponseEntity.ok("Contact information updated successfully.");
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            } catch (Exception e) {
                return ResponseEntity.internalServerError().body("Failed to update contact information.");
            }
        }
    }
