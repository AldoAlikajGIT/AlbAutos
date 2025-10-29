package albcars.project.repositories;

import albcars.project.entities.CarOption;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CarOptionRepository extends JpaRepository<CarOption, Long> {
    Optional<CarOption> findByName(String optionName); // Find option by name
}
