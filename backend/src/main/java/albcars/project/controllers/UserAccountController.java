package albcars.project.controllers;


import albcars.project.entities.CarDealership;
import albcars.project.repositories.CarDealershipRepository;
import albcars.project.DTO.CarAdDTO;
import albcars.project.DTO.CarAdMapper;
import albcars.project.DTO.UserInfoDTO;
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
@RequestMapping("/api/users/me")
public class UserAccountController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private albcars.project.securityConfig.CryptoService cryptoService;

    @Autowired
    private CarDealershipRepository carDealershipRepository;


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CarAdRepository carAdRepository;

    @Autowired
    private CarAdMapper carAdMapper;

    @GetMapping
    public ResponseEntity<?> getMyAccount(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        // Try user account
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();

            List<CarAdDTO> carAds = carAdRepository.findByUserId(user.getId())
                    .stream()
                    .map(carAdMapper::toDTO)
                    .collect(Collectors.toList());

            UserInfoDTO userInfo = new UserInfoDTO();
            userInfo.setEmail(user.getEmail());
            userInfo.setPhoneNumber(cryptoService.decrypt(user.getPhoneNumber()));
            userInfo.setRole(user.getRole().name());
            userInfo.setCarAds(carAds);

            return ResponseEntity.ok(userInfo);
        }

        // Try car dealership account
        Optional<CarDealership> dealerOpt = carDealershipRepository.findByEmail(email);
        if (dealerOpt.isPresent()) {
            CarDealership dealer = dealerOpt.get();

            List<CarAdDTO> carAds = carAdRepository.findByCarDealershipId(dealer.getId())
                    .stream()
                    .map(carAdMapper::toDTO)
                    .collect(Collectors.toList());

            UserInfoDTO dealerInfo = new UserInfoDTO();
            dealerInfo.setEmail(dealer.getEmail());
            dealerInfo.setPhoneNumber(cryptoService.decrypt(dealer.getPhoneNumber()));
            dealerInfo.setRole("CARDEALERSHIP");
            dealerInfo.setCarAds(carAds);

            return ResponseEntity.ok(dealerInfo);
        }

        return ResponseEntity.status(404).body("Account not found");
    }

}
