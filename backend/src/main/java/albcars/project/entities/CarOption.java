package albcars.project.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor

@AllArgsConstructor
@Table(name = "caroption")
public class CarOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "optionName")
    private String name;

    public String getName() {
        return name;
    }

    // ✅ Owning side of the relationship (FK is in this table)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_ad_id")
    private CarAd carAd;

    // ✅ Custom constructor to use when creating new options
    public CarOption(CarAd carAd, String name) {
        this.carAd = carAd;
        this.name = name;
    }
}
