package albcars.project.services;

import albcars.project.entities.CarAd;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.*;

import java.util.List;

public class carAdSpecification {

    public static Specification<CarAd> filterByCriteria(
            String brand, String model, Integer minPrice, Integer maxPrice,
            Integer minYear, Integer maxYear, Integer minMileage, Integer maxMileage,
            Integer minPowerHP, Integer maxPowerHP, Integer minPowerKW, Integer maxPowerKW,
            Integer doorCount, Integer seatCount, String exteriorColor,
            String interiorColor, String upholstery, String location,
            String fuel, String transmission, String body, List<String> options) {

        return (Root<CarAd> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            Predicate predicate = cb.conjunction();

            if (options != null && !options.isEmpty()) {
                Join<Object, Object> optionJoin = root.join("options", JoinType.INNER);
                predicate = cb.and(predicate, optionJoin.get("name").in(options));
                query.distinct(true);
            }


            if (brand != null && !brand.isEmpty()) {
                predicate = cb.and(predicate, cb.equal(root.get("brand").get("brandName"), brand));
            }
            if (model != null && !model.isEmpty()) {
                predicate = cb.and(predicate, cb.equal(root.get("model").get("modelName"), model));
            }

            if (minPrice != null) {
                predicate = cb.and(predicate, cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicate = cb.and(predicate, cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            if (minYear != null) {
                predicate = cb.and(predicate, cb.greaterThanOrEqualTo(root.get("year"), minYear));
            }
            if (maxYear != null) {
                predicate = cb.and(predicate, cb.lessThanOrEqualTo(root.get("year"), maxYear));
            }
            if (minMileage != null) {
                predicate = cb.and(predicate, cb.greaterThanOrEqualTo(root.get("mileageKm"), minMileage));
            }
            if (maxMileage != null) {
                predicate = cb.and(predicate, cb.lessThanOrEqualTo(root.get("mileageKm"), maxMileage));
            }
            if (minPowerHP != null) {
                predicate = cb.and(predicate, cb.greaterThanOrEqualTo(root.get("powerHP"), minPowerHP));
            }
            if (maxPowerHP != null) {
                predicate = cb.and(predicate, cb.lessThanOrEqualTo(root.get("powerHP"), maxPowerHP));
            }
            if (minPowerKW != null) {
                predicate = cb.and(predicate, cb.greaterThanOrEqualTo(root.get("powerKW"), minPowerKW));
            }
            if (maxPowerKW != null) {
                predicate = cb.and(predicate, cb.lessThanOrEqualTo(root.get("powerKW"), maxPowerKW));
            }
            if (doorCount != null) {
                predicate = cb.and(predicate, cb.equal(root.get("doorCount"), doorCount));
            }
            if (seatCount != null) {
                predicate = cb.and(predicate, cb.equal(root.get("seatCount"), seatCount));
            }

            if (exteriorColor != null && !exteriorColor.isEmpty()) {
                predicate = cb.and(predicate, cb.equal(root.get("exteriorColor"), exteriorColor));
            }
            if (interiorColor != null && !interiorColor.isEmpty()) {
                predicate = cb.and(predicate, cb.equal(root.get("interiorColor"), interiorColor));
            }
            if (upholstery != null && !upholstery.isEmpty()) {
                predicate = cb.and(predicate, cb.equal(root.get("upholstery"), upholstery));
            }
            if (location != null && !location.isEmpty()) {
                predicate = cb.and(predicate, cb.equal(root.get("location"), location));
            }

            if (fuel != null && !fuel.isEmpty()) {
                predicate = cb.and(predicate, cb.equal(root.get("fuel"), fuel));
            }
            if (transmission != null && !transmission.isEmpty()) {
                predicate = cb.and(predicate, cb.equal(root.get("transmission"), transmission));
            }
            if (body != null && !body.isEmpty()) {
                predicate = cb.and(predicate, cb.equal(root.get("body"), body));
            }



            return predicate;
        };
    }
}
