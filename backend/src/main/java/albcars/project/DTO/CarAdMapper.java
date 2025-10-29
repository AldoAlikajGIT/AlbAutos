package albcars.project.DTO;

import albcars.project.entities.CarAd;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class CarAdMapper {

    public CarAdDTO toDTO(CarAd ad) {
        CarAdDTO dto = new CarAdDTO();

        // 🧱 Basic field mapping
        dto.setId(ad.getId());
        dto.setYear(ad.getYear());
        dto.setMileageKm(ad.getMileageKm());
        dto.setFuel(ad.getFuel());
        dto.setPowerHP(ad.getPowerHP());
        dto.setPowerKW(ad.getPowerKW());
        dto.setTransmission(ad.getTransmission());
        dto.setBody(ad.getBody());
        dto.setLocation(ad.getLocation());
        dto.setPrice(ad.getPrice());
        dto.setDoorCount(ad.getDoorCount());
        dto.setSeatCount(ad.getSeatCount());
        dto.setExteriorColor(ad.getExteriorColor());
        dto.setInteriorColor(ad.getInteriorColor());
        dto.setUpholstery(ad.getUpholstery());
        dto.setConsumptionLPerKm(ad.getConsumptionLPerKm());
        dto.setCreatedAt(ad.getCreatedAt());
        dto.setDescription(ad.getDescription());

        // ✅ Brand & model (get names directly from entity)
        dto.setBrand(ad.getBrand() != null ? ad.getBrand().getBrandName() : "Unknown");
        dto.setModel(ad.getModel() != null ? ad.getModel().getModelName() : "Unknown");

        // 🖼️ Image URLs
        if (ad.getImages() != null) {
            dto.setImageUrls(ad.getImages().stream()
                    .map(image -> image.getImageUrl())
                    .collect(Collectors.toList()));
        }

        // ⚙️ Extra options
        if (ad.getOptions() != null) {
            dto.setOptions(ad.getOptions().stream()
                    .map(option -> option.getName())
                    .collect(Collectors.toList()));
        }

        // ☎️ Phone number from User or Dealership
        if (ad.getUser() != null) {
            dto.setPhoneNumber(ad.getUser().getPhoneNumber());
        } else if (ad.getCarDealership() != null) {
            dto.setPhoneNumber(ad.getCarDealership().getPhoneNumber());
        } else {
            dto.setPhoneNumber("N/A");
        }

        // ☎️ Phone number & Email from User or Dealership
        if (ad.getUser() != null) {
            dto.setPhoneNumber(ad.getUser().getPhoneNumber());
            dto.setEmail(ad.getUser().getEmail()); // ✅ Add this
        } else if (ad.getCarDealership() != null) {
            dto.setPhoneNumber(ad.getCarDealership().getPhoneNumber());
            dto.setEmail(ad.getCarDealership().getEmail()); // ✅ Add this
        } else {
            dto.setPhoneNumber("N/A");
            dto.setEmail("N/A"); // ✅ Fallback
        }

        if (ad.getUser() != null) {
            dto.setPhoneNumber(ad.getUser().getPhoneNumber());
            dto.setEmail(ad.getUser().getEmail());
            dto.setSellerRole("USER"); // ✅
            dto.setDealershipName(null); // Optional, for clarity
        } else if (ad.getCarDealership() != null) {
            dto.setPhoneNumber(ad.getCarDealership().getPhoneNumber());
            dto.setEmail(ad.getCarDealership().getEmail());
            dto.setSellerRole("CARDEALERSHIP"); // ✅
            dto.setDealershipName(ad.getCarDealership().getBusinessName()); // ✅ Add this line
        } else {
            dto.setPhoneNumber("N/A");
            dto.setEmail("N/A");
            dto.setSellerRole("UNKNOWN"); // Optional fallback
            dto.setDealershipName(null); // fallback
        }
        return dto;
    }
}
