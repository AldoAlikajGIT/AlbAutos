package albcars.project.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "car_dealership_password_reset_token")
public class CarDealershipPasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @OneToOne
    @JoinColumn(name = "car_dealership_id", referencedColumnName = "id")
    private CarDealership carDealership;

    @Column(name = "expiry_date", nullable = false)
    private LocalDateTime expiryDate;

    // Constructors
    public CarDealershipPasswordResetToken() {
    }

    public CarDealershipPasswordResetToken(String token, CarDealership carDealership, LocalDateTime expiryDate) {
        this.token = token;
        this.carDealership = carDealership;
        this.expiryDate = expiryDate;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getToken() {
        return token;
    }

    public CarDealership getCarDealership() {
        return carDealership;
    }

    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setCarDealership(CarDealership carDealership) {
        this.carDealership = carDealership;
    }

    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }
}
