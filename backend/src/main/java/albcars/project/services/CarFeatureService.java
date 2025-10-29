package albcars.project.services;

import albcars.project.entities.CarFeature;
import albcars.project.repositories.CarFeatureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarFeatureService {

    @Autowired
    private CarFeatureRepository carFeatureRepository;

    public List<CarFeature> getFeaturesByModel(Long modelId) {
        return carFeatureRepository.findByModel_Id(modelId);
    }
}
