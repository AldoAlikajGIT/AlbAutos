package albcars.project.repositories;

import albcars.project.entities.CarDealership;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CarDealershipRepository extends JpaRepository<CarDealership, Long> {
    Optional<CarDealership> findByEmail(String email);

    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);
    boolean existsByPhoneNumberHash(String phoneNumberHash);

}
