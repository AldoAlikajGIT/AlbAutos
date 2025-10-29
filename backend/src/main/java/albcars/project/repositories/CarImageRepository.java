package albcars.project.repositories;

import albcars.project.entities.CarImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarImageRepository extends JpaRepository<CarImage, Long> {
    List<CarImage> findByCarAdId(Long carAdId);  // Get images for a specific car ad
}
