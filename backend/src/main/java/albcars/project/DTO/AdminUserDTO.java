package albcars.project.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserDTO {
    private Long id;
    private String email;
    private String fullName;     // decrypted for admin UI
    private String phoneNumber;  // decrypted for admin UI
    private String role;         // "USER" / "ADMIN"
    private boolean active;
}
