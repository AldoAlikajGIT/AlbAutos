package albcars.project.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carAd")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CarAd {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relationships
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @ManyToOne
    @JoinColumn(name = "carDealership_id", nullable = true)
    private CarDealership carDealership;

    @OneToMany(mappedBy = "carAd", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<CarOption> options = new ArrayList<>();

    @OneToMany(mappedBy = "carAd", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<CarImage> images = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "brand_id", nullable = false)
    private CarBrand brand; // ✅ Proper entity relationship

    public CarBrand getBrand() {
        return brand;
    }

    public void setBrand(CarBrand brand) {
        this.brand = brand;
    }


    @ManyToOne
    @JoinColumn(name = "model_id", nullable = false)
    private CarModel model; // ✅ Proper entity relationship

    public CarModel getModel() {
        return model;
    }

    public void setModel(CarModel model) {
        this.model = model;
    }


    private int year;

    @Column(name = "mileage_km")
    private int mileageKm;

    private String fuel;

    @Column(name = "power_hp")
    private int powerHP;
    @Column(name = "power_kw")
    private int powerKW;

    private String transmission;
    private String body;
    private String location;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "door_count")
    private String doorCount;

    @Column(name = "seat_count")
    private String seatCount;

    @Column(name = "exterior_color")
    private String exteriorColor;

    @Column(name = "interior_color")
    private String interiorColor;

    private String upholstery;

    @Column(length = 250)
    private String description;

    @Column(name = "consumption_l_per_km")
    private BigDecimal consumptionLPerKm;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
