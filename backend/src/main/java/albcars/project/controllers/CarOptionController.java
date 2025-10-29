package albcars.project.controllers;

import albcars.project.entities.CarOption;
import albcars.project.services.CarOptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/options")
public class CarOptionController {

    @Autowired
    private CarOptionService carOptionService;

    @GetMapping("/all")
    public List<CarOption> getAllOptions() {
        return carOptionService.getAllOptions();
    }
}
