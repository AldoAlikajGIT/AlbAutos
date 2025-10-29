package albcars.project.securityConfig;

import io.github.bucket4j.Bucket;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Set;

@Component
public class RateLimitingFilter implements Filter {

    private final RateLimitingService rateLimitingService;

    // Endpoints you already rate-limit in controllers, or should be skipped
    private static final Set<String> SKIP_PREFIXES = Set.of(
            "/api/admin",                                // admin endpoints
            "/api/auth/forgot-password",
            "/api/auth/reset-password",
            "/api/auth/forgot-password-cardealership",
            "/api/auth/reset-password-cardealership",
            "/api/auth/login",
            "/api/auth/register",
            "/api/auth/dealerships/login",
            "/api/auth/dealerships/register",
            "/uploads/",
            "/api/cars"
    );

    public RateLimitingFilter(RateLimitingService rateLimitingService) {
        this.rateLimitingService = rateLimitingService;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req  = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        final String method = req.getMethod();
        final String path   = req.getRequestURI();

        // Preflight: never rate-limit
        if ("OPTIONS".equalsIgnoreCase(method)) {
            chain.doFilter(request, response);
            return;
        }

        // Skip well-known prefixes (you already handle limits in those controllers)
        if (shouldSkip(path, method)) {
            chain.doFilter(request, response);
            return;
        }

        // Build a key: prefer authenticated user; fallback to IP
        String principalKey = resolvePrincipalKey(req);

        // Per-route key so one endpoint cannot drain the whole quota
        String bucketKey = method + ":" + path + ":" + principalKey;

        // Default: 100 tokens per 60 seconds (tune as you wish)
        Bucket bucket = rateLimitingService.resolveBucket(bucketKey, 100, 60);

        if (bucket.tryConsume(1)) {
            chain.doFilter(request, response);
        } else {
            res.setStatus(429);
            // Frontend will show its own 429 message; keep server generic
            res.getWriter().write("Too many requests - try again later.");
        }
    }

    private boolean shouldSkip(String path, String method) {
        if (path == null) return true;
        for (String prefix : SKIP_PREFIXES) {
            if (path.startsWith(prefix)) return true;
        }
        // Your custom “controller-handled” endpoints:
        if (path.startsWith("/api/cars/search")) return true;
        if (path.startsWith("/api/cars") && "POST".equalsIgnoreCase(method)) return true;
        if (path.contains("/update-price") || path.contains("/update-contact")) return true;
        return false;
    }

    /**
     * Prefer Spring Security principal (set by JwtFilter); fallback to IP.
     * If you’re behind a proxy/load balancer, consider X-Forwarded-For.
     */
    private String resolvePrincipalKey(HttpServletRequest req) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            // Username is the email for your app
            String username = auth.getName(); // works regardless of principal type
            if (username != null && !username.isBlank()) {
                return "user:" + username;
            }
            Object principal = auth.getPrincipal();
            if (principal instanceof UserDetails ud && ud.getUsername() != null) {
                return "user:" + ud.getUsername();
            }
        }
        // Fallback to client IP; use X-Forwarded-For if behind a proxy
        String xff = req.getHeader("X-Forwarded-For");
        String ip  = (xff != null && !xff.isBlank()) ? xff.split(",")[0].trim() : req.getRemoteAddr();
        return "ip:" + ip;
    }
}
