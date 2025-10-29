package albcars.project.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "CarFeature")
public class CarFeature {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "model_id", nullable = false)
    private CarModel model;

    @ManyToOne
    @JoinColumn(name = "brand_id", nullable = false)
    private CarBrand brand;

    private int year;
    private int mileageKm;
    private String fuel;
    private int powerHp;
    private int powerKw;
    private String transmission;
    private String body;
    private String location;
    private String doorCount;
    private String seatCount;
    private String exteriorColor;
    private String interiorColor;
    private String upholstery;
    private BigDecimal consumptionLPerKm;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private String createdAt;
}
