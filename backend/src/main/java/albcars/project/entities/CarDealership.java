package albcars.project.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "cardealership")
public class CarDealership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "vatNumber", nullable = false, length = 512)
    private String vatNumber;

    @Column(name = "businessName", nullable = false, length = 512)
    private String businessName;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "email", nullable = false, unique = true)
    private String email; // ✅ DB already has UNIQUE KEY `email`

    @Column(name = "role", nullable = false)
    private String role = "carDealership";

    @Column(name = "phone_number_hash", unique = true)
    private String phoneNumberHash;

}
