package albcars.project.pass;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHasher {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "Aldo17%";  // 🔥 Change this to your actual password
        String hashedPassword = encoder.encode(rawPassword);

        System.out.println("🔑 Hashed Password: " + hashedPassword);
    }
}
