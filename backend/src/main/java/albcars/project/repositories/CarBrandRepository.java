package albcars.project.repositories;

import albcars.project.entities.CarBrand;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CarBrandRepository extends JpaRepository<CarBrand, Long> {
    Optional<CarBrand> findByBrandNameIgnoreCase(String brandName); // ✅ FIXED
}
