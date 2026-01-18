package albcars.project.DTO;

import albcars.project.entities.CarAd;
import albcars.project.securityConfig.CryptoService;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class CarAdMapper {

    private final CryptoService cryptoService;

    public CarAdMapper(CryptoService cryptoService) {
        this.cryptoService = cryptoService;
    }

    public CarAdDTO toDTO(CarAd ad) {
        CarAdDTO dto = new CarAdDTO();

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

        dto.setBrand(ad.getBrand() != null ? ad.getBrand().getBrandName() : "Unknown");
        dto.setModel(ad.getModel() != null ? ad.getModel().getModelName() : "Unknown");

        if (ad.getImages() != null) {
            dto.setImageUrls(ad.getImages().stream()
                    .map(i -> i.getImageUrl())
                    .collect(Collectors.toList()));
        }

        if (ad.getOptions() != null) {
            dto.setOptions(ad.getOptions().stream()
                    .map(o -> o.getName())
                    .collect(Collectors.toList()));
        }

        // Seller contact info (decrypt stored encrypted fields)
        if (ad.getUser() != null) {
            dto.setSellerRole("USER");
            dto.setEmail(ad.getUser().getEmail());
            dto.setPhoneNumber(safeDecrypt(ad.getUser().getPhoneNumber()));
            dto.setDealershipName(null);
        } else if (ad.getCarDealership() != null) {
            dto.setSellerRole("CARDEALERSHIP");
            dto.setEmail(ad.getCarDealership().getEmail());
            dto.setPhoneNumber(safeDecrypt(ad.getCarDealership().getPhoneNumber()));
            dto.setDealershipName(safeDecrypt(ad.getCarDealership().getBusinessName()));
        } else {
            dto.setSellerRole("UNKNOWN");
            dto.setEmail("N/A");
            dto.setPhoneNumber("N/A");
            dto.setDealershipName(null);
        }

        return dto;
    }

    private String safeDecrypt(String value) {
        if (value == null || value.isBlank()) return value;
        try {
            return cryptoService.decrypt(value);
        } catch (Exception e) {
            // legacy plaintext fallback
            return value;
        }
    }
}
