package albcars.project.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "car_images")
public class CarImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_ad_id", nullable = false)
    @JsonIgnore
    private CarAd carAd;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    // Constructors
    public CarImage() {}

    public CarImage(CarAd carAd, String imageUrl) {
        this.carAd = carAd;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public CarAd getCarAd() {
        return carAd;
    }

    public void setCarAd(CarAd carAd) {
        this.carAd = carAd;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    @Override
    public String toString() {
        return "CarImage{" +
                "id=" + id +
                ", imageUrl='" + imageUrl + '\'' +
                '}';
    }
}
