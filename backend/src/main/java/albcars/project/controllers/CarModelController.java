package albcars.project.controllers;

import albcars.project.entities.CarModel;
import albcars.project.services.CarModelService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/models")
public class CarModelController {

    private final CarModelService carModelService;

    public CarModelController(CarModelService carModelService) {
        this.carModelService = carModelService;
    }

    @GetMapping("/brand/{brandId}")
    public List<CarModel> getModelsByBrand(@PathVariable Long brandId) {
        return carModelService.getModelsByBrand(brandId);
    }
}
