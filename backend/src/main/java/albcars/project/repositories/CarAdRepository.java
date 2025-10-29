package albcars.project.repositories;

import albcars.project.entities.CarAd;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDateTime;
import java.util.List;

public interface CarAdRepository extends JpaRepository<CarAd, Long>, JpaSpecificationExecutor<CarAd> {

    // Fetch car ads by user ID
    List<CarAd> findByUserId(Long userId);

    // Optionally, fetch by dealership ID if needed
    List<CarAd> findByCarDealershipId(Long carDealershipId);

    // Find all ads older than a specific date
    List<CarAd> findByCreatedAtBefore(LocalDateTime date);
}
