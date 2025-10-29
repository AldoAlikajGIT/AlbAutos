package albcars.project.controllers;

import albcars.project.entities.CarBrand;
import albcars.project.services.CarBrandService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
public class CarBrandController {

    private final CarBrandService carBrandService;

    public CarBrandController(CarBrandService carBrandService) {
        this.carBrandService = carBrandService;
    }

    @GetMapping
    public List<CarBrand> getBrands() {
        return carBrandService.getAllBrands();  // Fetch all brands using service layer
    }
}
