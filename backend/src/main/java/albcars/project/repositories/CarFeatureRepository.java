package albcars.project.repositories;

import albcars.project.entities.CarFeature;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CarFeatureRepository extends JpaRepository<CarFeature, Long> {
    List<CarFeature> findByModel_Id(Long modelId); // Get features by model
}
