package albcars.project.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "carDealership")
public class CarDealership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "phone_number", nullable = false, unique = true)
    private String phoneNumber;

    @Column(name = "vatNumber", nullable = false, length = 255)
    private String vatNumber;

    @Column(name = "businessName", nullable = false)
    private String businessName;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "email", nullable = false, unique = true)
    private String email; // ✅ DB already has UNIQUE KEY `email`

    @Column(name = "role", nullable = false)
    private String role = "carDealership";
}
