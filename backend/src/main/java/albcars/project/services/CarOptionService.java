package albcars.project.services;

import albcars.project.entities.CarOption;
import albcars.project.repositories.CarOptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarOptionService {

    @Autowired
    private CarOptionRepository carOptionRepository;

    public List<CarOption> getAllOptions() {
        return carOptionRepository.findAll();
    }

    public CarOption saveCarOption(CarOption carOption) {
        return carOptionRepository.save(carOption);
    }
}
