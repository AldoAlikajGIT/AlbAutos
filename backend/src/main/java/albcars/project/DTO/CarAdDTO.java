package albcars.project.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarAdDTO {
    private Long id;
    private String email;
    private String phoneNumber;
    private String brand;
    private String model;
    private int year;
    private int mileageKm;
    private String fuel;
    private int powerHP;
    private int powerKW;
    private String transmission;
    private String body;
    private String location;
    private BigDecimal price;
    private String doorCount;
    private String seatCount;
    private String exteriorColor;
    private String interiorColor;
    private String upholstery;
    private String description;
    private BigDecimal consumptionLPerKm;
    private List<String> imageUrls; // From CarImage entity
    private List<String> options;   // From CarOption entity
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime createdAt;
    private String sellerRole;
    private String dealershipName;
    private String businessName;
}
