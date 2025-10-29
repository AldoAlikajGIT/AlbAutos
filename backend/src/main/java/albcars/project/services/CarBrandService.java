package albcars.project.services;

import albcars.project.entities.CarBrand;
import albcars.project.repositories.CarBrandRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarBrandService {

    private final CarBrandRepository carBrandRepository;

    public CarBrandService(CarBrandRepository carBrandRepository) {
        this.carBrandRepository = carBrandRepository;
    }

    public List<CarBrand> getAllBrands() {
        return carBrandRepository.findAll(); // Fetch all brands from the database
    }
}
