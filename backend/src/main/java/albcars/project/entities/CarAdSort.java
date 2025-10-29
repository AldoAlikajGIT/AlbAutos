package albcars.project.entities; // or dto package if you prefer

public enum CarAdSort {
    PRICE_ASC,
    PRICE_DESC,
    YEAR_ASC,      // "first registration" oldest first
    YEAR_DESC,     // "last registration" newest first
    MILEAGE_ASC,
    MILEAGE_DESC;

    public org.springframework.data.domain.Sort toSpringSort() {
        return switch (this) {
            case PRICE_ASC   -> org.springframework.data.domain.Sort.by("price").ascending();
            case PRICE_DESC  -> org.springframework.data.domain.Sort.by("price").descending();
            case YEAR_ASC    -> org.springframework.data.domain.Sort.by("year").ascending();
            case YEAR_DESC   -> org.springframework.data.domain.Sort.by("year").descending();
            case MILEAGE_ASC -> org.springframework.data.domain.Sort.by("mileageKm").ascending();
            case MILEAGE_DESC-> org.springframework.data.domain.Sort.by("mileageKm").descending();
        };
    }
}
