package albcars.project.repositories;

import albcars.project.entities.CarBrand;
import albcars.project.entities.CarModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CarModelRepository extends JpaRepository<CarModel, Long> {
    List<CarModel> findByBrandId(Long brandId);
    Optional<CarModel> findByModelNameIgnoreCaseAndBrand(String modelName, CarBrand brand);
    // ✅ ADD THIS
}
