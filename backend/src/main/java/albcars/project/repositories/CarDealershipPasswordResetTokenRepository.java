package albcars.project.repositories;

import albcars.project.entities.CarDealershipPasswordResetToken;
import albcars.project.entities.CarDealership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CarDealershipPasswordResetTokenRepository extends JpaRepository<CarDealershipPasswordResetToken, Long> {
    Optional<CarDealershipPasswordResetToken> findByToken(String token);
    void deleteByCarDealership(CarDealership carDealership);
    void flush(); // ✅ add this to force DB commit after delete
}
