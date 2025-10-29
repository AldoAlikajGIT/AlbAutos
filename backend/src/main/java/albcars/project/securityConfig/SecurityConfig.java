package albcars.project.securityConfig;

import albcars.project.services.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final RateLimitingFilter rateLimitingFilter;

    public SecurityConfig(JwtFilter jwtFilter, RateLimitingFilter rateLimitingFilter) {
        this.jwtFilter = jwtFilter;
        this.rateLimitingFilter = rateLimitingFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> {})
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/register",
                                "/api/auth/login",
                                "/api/auth/dealerships/register",
                                "/api/auth/dealerships/login",
                                "/api/cars/all",
                                "/api/brands/**",
                                "/api/models/**",
                                "/api/users/hash",
                                "/api/auth/forgot-password",
                                "/api/auth/reset-password",
                                "/api/auth/forgot-password-cardealership",
                                "/api/auth/reset-password-cardealership"
                        ).permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/images/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/images/upload/**").hasAnyRole("USER", "ADMIN", "CARDEALERSHIP")
                        .requestMatchers(HttpMethod.POST, "/api/images/upload-multiple/**").hasAnyRole("USER", "ADMIN", "CARDEALERSHIP")
                        .requestMatchers(HttpMethod.GET, "/api/users/role-check").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/cars").hasAnyRole("USER", "ADMIN", "CARDEALERSHIP")
                        .requestMatchers("/api/admin/login").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/users/me").hasAnyRole("USER", "ADMIN","CARDEALERSHIP")
                        .requestMatchers(HttpMethod.DELETE, "/api/cars/delete/{id}").hasAnyRole("USER", "ADMIN", "CARDEALERSHIP")
                        .requestMatchers(HttpMethod.PUT, "/api/cars/{id}").hasAnyRole("USER", "ADMIN", "CARDEALERSHIP")
                        .requestMatchers(HttpMethod.PATCH, "/api/dealerships/update-contact").hasAnyRole("CARDEALERSHIP", "ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/users/update-contact").hasAnyRole("USER","ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/cars/**").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(rateLimitingFilter, JwtFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return userDetailsServiceImpl;
    }

    @Autowired
    private UserDetailsServiceImpl userDetailsServiceImpl;

    @Bean
    public AuthenticationManager authenticationManager(UserDetailsServiceImpl userDetailsServiceImpl) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsServiceImpl);
        provider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(List.of(provider));
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // ✅ All frontend origins
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:3000",
                "http://albautos.com",
                "https://albautos.com",
                "http://www.albautos.com",
                "https://www.albautos.com",
                "https://albautos.netlify.app"
        ));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);   // needed for cookies / auth headers
        config.setMaxAge(3600L);            // cache preflight for 1 hour

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
