package albcars.project.services;

import albcars.project.entities.User;
import albcars.project.entities.CarDealership;
import albcars.project.repositories.UserRepository;
import albcars.project.repositories.CarDealershipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CarDealershipRepository dealershipRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // First try to find a regular user
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null) {
            String roleName = "ROLE_" + user.getRole().name(); // e.g. "USER", "ADMIN"
            return new org.springframework.security.core.userdetails.User(
                    user.getEmail(),
                    user.getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority(roleName))
            );
        }

        // Then try to find a car dealership
        CarDealership dealership = dealershipRepository.findByEmail(email).orElse(null);
        if (dealership != null) {
            String roleName = "ROLE_" + dealership.getRole().toUpperCase(); // e.g. "CARDEALERSHIP"
            return new org.springframework.security.core.userdetails.User(
                    dealership.getEmail(),
                    dealership.getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority(roleName))
            );
        }

        // If neither found
        throw new UsernameNotFoundException("No user or dealership found with email: " + email);
    }
}
