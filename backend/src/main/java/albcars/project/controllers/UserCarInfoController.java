package albcars.project.controllers;

import albcars.project.DTO.CarAdDTO;
import albcars.project.DTO.CarAdMapper;
import albcars.project.entities.CarAd;
import albcars.project.entities.User;
import albcars.project.repositories.CarAdRepository;
import albcars.project.repositories.UserRepository;
import albcars.project.securityConfig.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users/car-ads")
public class UserCarInfoController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CarAdRepository carAdRepository;

    @Autowired
    private CarAdMapper carAdMapper;


    @GetMapping
    public ResponseEntity<?> getUserCarAds(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }

        User user = userOpt.get();

        List<CarAdDTO> carAds = carAdRepository.findByUserId(user.getId())
                .stream()
                .map(carAdMapper::toDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(carAds);
    }
}
