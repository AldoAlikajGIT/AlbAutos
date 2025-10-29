package albcars.project.services;

import albcars.project.entities.CarModel;
import albcars.project.repositories.CarModelRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarModelService {

    private final CarModelRepository carModelRepository;

    public CarModelService(CarModelRepository carModelRepository) {
        this.carModelRepository = carModelRepository;
    }

    public List<CarModel> getModelsByBrand(Long brandId) {
        return carModelRepository.findByBrandId(brandId);
    }
}
