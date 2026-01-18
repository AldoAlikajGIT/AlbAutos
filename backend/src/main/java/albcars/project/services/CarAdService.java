package albcars.project.services;
import albcars.project.DTO.CarAdDTO;
import albcars.project.entities.*;
import albcars.project.repositories.*;
import org.springframework.data.domain.Sort;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CarAdService {

    @Autowired
    private albcars.project.DTO.CarAdMapper carAdMapper;

    @Autowired
    private CarBrandRepository carBrandRepository;

    @Autowired
    private CarModelRepository carModelRepository;


    @Autowired
    private CarAdRepository carAdRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CarDealershipRepository carDealershipRepository;

    // Method to delete ads older than 6 months
    public void deleteExpiredAds() {
        // Get the date 6 months ago from now
        LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6);

        // Find ads older than 6 months
        List<CarAd> expiredAds = carAdRepository.findByCreatedAtBefore(sixMonthsAgo);

        // Delete expired ads
        for (CarAd ad : expiredAds) {
            carAdRepository.delete(ad);
        }
    }

    private Sort toSpringSort(CarAdSort sortOpt) {
        if (sortOpt == null) return Sort.unsorted();
        switch (sortOpt) {
            case PRICE_ASC:       return Sort.by(Sort.Direction.ASC,  "price");
            case PRICE_DESC:      return Sort.by(Sort.Direction.DESC, "price");
            case YEAR_ASC:        return Sort.by(Sort.Direction.ASC,  "year");          // oldest first (first registration)
            case YEAR_DESC:       return Sort.by(Sort.Direction.DESC, "year");          // newest first (last registration)
            case MILEAGE_ASC:     return Sort.by(Sort.Direction.ASC,  "mileageKm");     // lowest mileage
            case MILEAGE_DESC:    return Sort.by(Sort.Direction.DESC, "mileageKm");     // highest mileage
            default:              return Sort.unsorted();
        }
    }

    // 🔍 Search Logic
    public List<CarAd> searchCars(
            String brand, String model, Integer minPrice, Integer maxPrice,
            Integer minYear, Integer maxYear, Integer minMileage, Integer maxMileage,
            Integer minPowerHP, Integer maxPowerHP, Integer minPowerKW, Integer maxPowerKW,
            Integer doorCount, Integer seatCount, String exteriorColor,
            String interiorColor, String upholstery, String location,String fuel, String transmission, String body, List<String> options, CarAdSort sort ) {

        Specification<CarAd> spec = carAdSpecification.filterByCriteria(
                brand, model, minPrice, maxPrice, minYear, maxYear, minMileage, maxMileage,
                minPowerHP, maxPowerHP, minPowerKW, maxPowerKW, doorCount, seatCount,
                exteriorColor, interiorColor, upholstery, location, fuel, transmission, body, options);

        return carAdRepository.findAll(spec, toSpringSort(sort));
    }

    public CarAd createAd(CarAdDTO adDTO, String email) {

        CarAd ad = new CarAd();


        Optional<User> user = userRepository.findByEmail(email);
        Optional<CarDealership> dealership = carDealershipRepository.findByEmail(email);

        if (user.isPresent()) {
            ad.setUser(user.get());
        } else if (dealership.isPresent()) {
            ad.setCarDealership(dealership.get());
        } else {
            throw new RuntimeException("No user or dealership found for email: " + email);
        }

        // 🔁 Convert brand name to brandId
        CarBrand brand = carBrandRepository.findByBrandNameIgnoreCase(adDTO.getBrand())
                .orElseThrow(() -> new IllegalArgumentException("Invalid brand: " + adDTO.getBrand()));
        ad.setBrand(brand);

        carModelRepository.findByModelNameIgnoreCaseAndBrand(adDTO.getModel(), brand)
                .ifPresentOrElse(
                        model -> ad.setModel(model),
                        () -> { throw new IllegalArgumentException("Invalid model for brand: " + adDTO.getModel()); }
                );


        // 🧱 Fill in other fields
        ad.setYear(adDTO.getYear());
        ad.setMileageKm(adDTO.getMileageKm());
        ad.setFuel(adDTO.getFuel());
        ad.setPowerHP(adDTO.getPowerHP());
        ad.setPowerKW(adDTO.getPowerKW());
        ad.setTransmission(adDTO.getTransmission());
        ad.setBody(adDTO.getBody());
        ad.setLocation(adDTO.getLocation());
        ad.setPrice(adDTO.getPrice());
        ad.setDoorCount(adDTO.getDoorCount());
        ad.setSeatCount(adDTO.getSeatCount());
        ad.setExteriorColor(adDTO.getExteriorColor());
        ad.setInteriorColor(adDTO.getInteriorColor());
        ad.setUpholstery(adDTO.getUpholstery());
        ad.setConsumptionLPerKm(adDTO.getConsumptionLPerKm());
        ad.setDescription(adDTO.getDescription());
        ad.setCreatedAt(LocalDateTime.now());

        // 🖼️ Save images
        if (adDTO.getImageUrls() != null) {
            adDTO.getImageUrls().forEach(url -> {
                CarImage image = new CarImage(ad, url);
                ad.getImages().add(image);  // Ensure CarAd has getImages().add(...)
            });
        }

// 🛠️ Save extra options
        if (adDTO.getOptions() != null) {
            adDTO.getOptions().forEach(option -> {
                CarOption carOption = new CarOption(ad, option);
                ad.getOptions().add(carOption);  // Ensure CarAd has getOptions().add(...)
            });
        }

        return carAdRepository.save(ad);
    }

    // ✅ Retrieve All Ads
    public List<CarAd> getAllAds() {
        return carAdRepository.findAll();
    }

    // ✅ Retrieve Ad by ID
    public CarAd getAdById(Long adId) {
        return carAdRepository.findById(adId)
                .orElseThrow(() -> new IllegalArgumentException("Car Ad not found"));
    }

    // ✅ Update Ad
    public CarAd updatePriceOnly(Long adId, BigDecimal price, String email) {
        CarAd ad = carAdRepository.findById(adId)
                .orElseThrow(() -> new IllegalArgumentException("Car Ad not found"));

        if ((ad.getUser() != null && ad.getUser().getEmail().equals(email)) ||
                (ad.getCarDealership() != null && ad.getCarDealership().getEmail().equals(email))) {

            if (price.compareTo(BigDecimal.ONE) < 0) {
                throw new IllegalArgumentException("Price must be at least 1.");
            }

            ad.setPrice(price);
            return carAdRepository.save(ad);
        } else {
            throw new SecurityException("You can only update your own ads.");
        }
    }


    public List<CarAd> getCarAdsByUserId(Long userId) {
        return carAdRepository.findByUserId(userId);
    }

    // ✅ Delete Ad
    public void deleteAd(Long adId, String email) {
        CarAd ad = carAdRepository.findById(adId)
                .orElseThrow(() -> new IllegalArgumentException("Car Ad not found"));

        if ((ad.getUser() != null && ad.getUser().getEmail().equals(email)) ||
                (ad.getCarDealership() != null && ad.getCarDealership().getEmail().equals(email))) {
            carAdRepository.delete(ad);
        } else {
            throw new SecurityException("You can only delete your own ads.");
        }

    }

    public List<CarAdDTO> getCarAdsByUserEmailAsDTO(String email) {
        String normalized = email == null ? "" : email.trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(normalized);
        if (userOpt.isEmpty()) return List.of();

        return carAdRepository.findByUserId(userOpt.get().getId())
                .stream()
                .map(carAdMapper::toDTO)
                .toList();
    }

    public void adminDeleteAdById(Long adId) {
        CarAd ad = carAdRepository.findById(adId)
                .orElseThrow(() -> new IllegalArgumentException("Car Ad not found"));
        carAdRepository.delete(ad);
    }
}
