package albcars.project.controllers;

import albcars.project.DTO.CarAdDTO;
import albcars.project.entities.CarAd;
import albcars.project.DTO.CarAdMapper;
import albcars.project.entities.CarAdSort;
import albcars.project.securityConfig.RateLimitingService;
import albcars.project.services.CarAdService;
import io.github.bucket4j.Bucket;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cars")
public class CarAdController {

    @Autowired
    private CarAdService carAdService;

    @Autowired
    private CarAdMapper carAdMapper;

    @Autowired
    private RateLimitingService rateLimitingService;


    // ✅ Create a new car advertisement
    @PostMapping
    public ResponseEntity<CarAdDTO> createAd(@RequestBody CarAdDTO carAdDTO, @RequestParam String email, HttpServletRequest request) {

        String clientKey = "createAd:" + request.getRemoteAddr();
        Bucket bucket = rateLimitingService.resolveBucket(clientKey, 5, 60); // test: 2 per minute

        System.out.println("Tokens BEFORE consume for " + clientKey + ": " + bucket.getAvailableTokens());
        if (!bucket.tryConsume(1)) {
            return ResponseEntity.status(429).build();
        }

        System.out.println("🚗 Creating car ad from email: " + email);
        System.out.println("📦 Brand (from DTO): " + carAdDTO.getBrand());
        System.out.println("📦 Model (from DTO): " + carAdDTO.getModel());

        CarAd createdCarAd = carAdService.createAd(carAdDTO, email);
        CarAdDTO responseDTO = carAdMapper.toDTO(createdCarAd);
        return ResponseEntity.ok(responseDTO);
    }

    // ✅ Retrieve all car advertisements
    @GetMapping("/all")
    public ResponseEntity<List<CarAdDTO>> getAllAds() {
        List<CarAdDTO> carAds = carAdService.getAllAds()
                .stream()
                .map(carAdMapper::toDTO)
                .toList();
        return ResponseEntity.ok(carAds);
    }

    // ✅ Retrieve a specific car advertisement by ID
    @GetMapping("/{id}")
    public ResponseEntity<CarAdDTO> getAdById(@PathVariable Long id) {
        CarAd carAd = carAdService.getAdById(id);
        return ResponseEntity.ok(carAdMapper.toDTO(carAd));
    }


    @PatchMapping("/update-price/{id}")
    public ResponseEntity<CarAdDTO> updateAdPrice(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates,
            Principal principal,
            HttpServletRequest request
    ) {
        String clientKey = "update:" + request.getRemoteAddr();
        Bucket bucket = rateLimitingService.resolveBucket(clientKey, 1, 3600);

        System.out.println("Tokens BEFORE consume for " + clientKey + ": " + bucket.getAvailableTokens());
        if (!bucket.tryConsume(1)) {
            return ResponseEntity.status(429).build();
        }

        String email = principal.getName();

        // ✅ Validate presence of "price"
        if (!updates.containsKey("price")) {
            return ResponseEntity.badRequest().body(null);
        }

        try {
            BigDecimal newPrice = new BigDecimal(updates.get("price").toString());

            // ✅ Validate price ≥ 1
            if (newPrice.compareTo(BigDecimal.ONE) < 0) {
                return ResponseEntity.badRequest().body(null);
            }

            // ✅ Delegate to service
            CarAd updatedAd = carAdService.updatePriceOnly(id, newPrice, email);

            // ✅ Convert to DTO and return
            return ResponseEntity.ok(carAdMapper.toDTO(updatedAd));

        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // 🗑️ Delete car ad
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteAd(@PathVariable Long id, @RequestParam String email) {
        carAdService.deleteAd(id, email);
        return ResponseEntity.noContent().build();
    }

    // 🔍 Search for car ads with filters
    @GetMapping("/search")
    public ResponseEntity<List<CarAdDTO>> searchCars(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) Integer minYear,
            @RequestParam(required = false) Integer maxYear,
            @RequestParam(required = false) Integer minMileage,
            @RequestParam(required = false) Integer maxMileage,
            @RequestParam(required = false) Integer minPowerHP,
            @RequestParam(required = false) Integer maxPowerHP,
            @RequestParam(required = false) Integer minPowerKW,
            @RequestParam(required = false) Integer maxPowerKW,
            @RequestParam(required = false) Integer doorCount,
            @RequestParam(required = false) Integer seatCount,
            @RequestParam(required = false) String exteriorColor,
            @RequestParam(required = false) String interiorColor,
            @RequestParam(required = false) String upholstery,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String fuel,
            @RequestParam(required = false) String transmission,
            @RequestParam(required = false) String body,
            @RequestParam(required = false) CarAdSort sort,
            @RequestParam(value = "options", required = false) List<String> options,
            HttpServletRequest request
    )

    {
        String clientKey = "search:" + request.getRemoteAddr();
        Bucket bucket = rateLimitingService.resolveBucket(clientKey, 500, 3600);

        System.out.println("Tokens BEFORE consume for " + clientKey + ": " + bucket.getAvailableTokens());
        if (!bucket.tryConsume(1)) {
            return ResponseEntity.status(429).build();
        }

        System.out.println("brand = " + brand);
        System.out.println("model = " + model);
        System.out.println("fuel = " + fuel);
        System.out.println("transmission = " + transmission);
        System.out.println("body = " + body);
        System.out.println("location = " + location);
        System.out.println("exteriorColor = " + exteriorColor);
        System.out.println("interiorColor = " + interiorColor);
        System.out.println("upholstery = " + upholstery);

        List<CarAdDTO> results = carAdService.searchCars(
                        brand, model, minPrice, maxPrice, minYear, maxYear,
                        minMileage, maxMileage, minPowerHP, maxPowerHP,
                        minPowerKW, maxPowerKW, doorCount, seatCount,
                        exteriorColor, interiorColor, upholstery, location, fuel, transmission, body, options, sort
                ).stream()
                .map(carAdMapper::toDTO)
                .toList();

        return ResponseEntity.ok(results);
    }
}
