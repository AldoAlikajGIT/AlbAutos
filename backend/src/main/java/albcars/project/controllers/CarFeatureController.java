package albcars.project.controllers;

import albcars.project.entities.CarFeature;
import albcars.project.services.CarFeatureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/features")
public class CarFeatureController {

    @Autowired
    private CarFeatureService carFeatureService;

    @GetMapping("/model/{modelId}")
    public List<CarFeature> getFeaturesByModel(@PathVariable Long modelId) {
        return carFeatureService.getFeaturesByModel(modelId);
    }
}
