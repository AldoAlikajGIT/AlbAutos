package albcars.project.services;

import albcars.project.entities.CarImage;
import albcars.project.repositories.CarImageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CarImageService {

    private final CarImageRepository carImageRepository;

    public CarImageService(CarImageRepository carImageRepository) {
        this.carImageRepository = carImageRepository;
    }

    public CarImage saveImage(CarImage image) {
        return carImageRepository.save(image);
    }

    public List<CarImage> getImagesByCarAdId(Long carAdId) {
        return carImageRepository.findByCarAdId(carAdId);
    }

    public Optional<CarImage> getImageById(Long id) {
        return carImageRepository.findById(id);
    }

    public void deleteImage(Long imageId) {
        carImageRepository.deleteById(imageId);
    }
}
