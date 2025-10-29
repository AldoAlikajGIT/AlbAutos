package albcars.project.controllers;

import albcars.project.entities.CarAd;
import albcars.project.entities.CarImage;
import albcars.project.services.CarAdService;
import albcars.project.services.CarImageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils; // ⬅️ added
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api/images")
public class CarImageController {

    // Read from application.properties: uploads.root=./uploads/cars
    @Value("${uploads.root}")
    private String uploadsRootProp;

    private Path UPLOAD_ROOT;

    // Limits & validation
    private static final int MAX_IMAGES_PER_AD = 15;
    private static final long MAX_BYTES_PER_FILE = 5L * 1024 * 1024; // 5 MB
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"
    );

    private final CarImageService carImageService;
    private final CarAdService carAdService;

    public CarImageController(CarImageService carImageService, CarAdService carAdService) {
        this.carImageService = carImageService;
        this.carAdService = carAdService;
    }

    @PostConstruct
    void init() {
        // Resolve and create the folder once at startup
        this.UPLOAD_ROOT = Paths.get(uploadsRootProp).toAbsolutePath().normalize();
        try {
            Files.createDirectories(UPLOAD_ROOT);
        } catch (IOException e) {
            throw new RuntimeException("Failed to create upload directory: " + UPLOAD_ROOT, e);
        }
        System.out.println("📁 UPLOAD_ROOT = " + UPLOAD_ROOT);
    }

    /* =============== Single upload =============== */
    @PostMapping(path = "/upload/{carAdId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImage(@PathVariable Long carAdId,
                                         @RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("❌ No file provided.");
        }
        CarAd ad = getAdOr404(carAdId);
        if (ad == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Car ad not found.");

        int existingCount = carImageService.getImagesByCarAdId(carAdId).size();
        if (existingCount >= MAX_IMAGES_PER_AD) {
            return ResponseEntity.badRequest().body("❌ This ad already has the maximum of " + MAX_IMAGES_PER_AD + " images.");
        }

        ResponseEntity<?> problem = validateFile(file);
        if (problem != null) return problem;

        String imageUrl = saveOneImage(ad, file); // returns /api/images/<filename>
        if (imageUrl == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("❌ File upload failed");
        }
        return ResponseEntity.ok(imageUrl);
    }

    /* =============== Multi upload =============== */
    @PostMapping(path = "/upload-multiple/{carAdId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImages(@PathVariable Long carAdId,
                                          @RequestParam("files") List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            return ResponseEntity.badRequest().body("❌ No files provided.");
        }
        CarAd ad = getAdOr404(carAdId);
        if (ad == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Car ad not found.");

        int existingCount = carImageService.getImagesByCarAdId(carAdId).size();
        if (existingCount + files.size() > MAX_IMAGES_PER_AD) {
            int remaining = Math.max(0, MAX_IMAGES_PER_AD - existingCount);
            return ResponseEntity.badRequest().body("❌ Too many files. This ad can accept " + remaining + " more.");
        }

        for (MultipartFile f : files) {
            ResponseEntity<?> problem = validateFile(f);
            if (problem != null) return problem;
        }

        List<String> urls = new ArrayList<>();
        for (MultipartFile f : files) {
            String url = saveOneImage(ad, f);
            if (url == null) {
                // Best-effort cleanup if something failed mid-way
                for (String u : urls) {
                    deletePhysicalByUrl(u);
                    deleteDbByUrl(u);
                }
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("❌ Failed to save files.");
            }
            urls.add(url);
        }
        return ResponseEntity.ok(urls);
    }

    /* =============== Serve image by filename or by UUID prefix =============== */
    @GetMapping("/{idOrFilename}")
    public ResponseEntity<Resource> getImage(@PathVariable String idOrFilename) {
        System.out.println("GET /api/images -> " + idOrFilename);

        if (idOrFilename.contains("..") || idOrFilename.contains("/") || idOrFilename.contains("\\")) {
            return ResponseEntity.badRequest().build();
        }

        // Try exact file first
        Path exact = UPLOAD_ROOT.resolve(idOrFilename).normalize();
        if (exact.startsWith(UPLOAD_ROOT) && Files.exists(exact) && Files.isReadable(exact)) {
            return serveFile(exact, exact.getFileName().toString());
        }

        // Fallback: match "uuid_prefix..." style names
        try {
            try (var stream = Files.list(UPLOAD_ROOT)) {
                Optional<Path> match = stream
                        .filter(Files::isRegularFile)
                        .filter(p -> p.getFileName().toString().startsWith(idOrFilename))
                        .findFirst();
                if (match.isPresent()) {
                    Path found = match.get().normalize();
                    if (found.startsWith(UPLOAD_ROOT)) {
                        return serveFile(found, found.getFileName().toString());
                    }
                }
            }
        } catch (IOException ignored) {}

        return ResponseEntity.notFound().build();
    }

    private ResponseEntity<Resource> serveFile(Path filePath, String downloadName) {
        try {
            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }
            String detected = null;
            try { detected = Files.probeContentType(filePath); } catch (IOException ignored) {}
            MediaType mediaType = (detected != null)
                    ? MediaType.parseMediaType(detected)
                    : MediaType.APPLICATION_OCTET_STREAM;

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + downloadName + "\"")
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /* =============== List & delete =============== */
    @GetMapping("/car/{carAdId}")
    public ResponseEntity<List<CarImage>> getImagesByCarAd(@PathVariable Long carAdId) {
        return ResponseEntity.ok(carImageService.getImagesByCarAdId(carAdId));
    }

    @DeleteMapping("/delete/{imageId}")
    public ResponseEntity<String> deleteImage(@PathVariable Long imageId) {
        Optional<CarImage> carImageOptional = carImageService.getImageById(imageId);
        if (carImageOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Image not found");
        }
        CarImage carImage = carImageOptional.get();
        String storedUrl = carImage.getImageUrl();   // e.g. "/api/images/<filename>"
        String filename = storedUrl.substring(storedUrl.lastIndexOf('/') + 1);

        try {
            Path filePath = UPLOAD_ROOT.resolve(filename).normalize();
            if (filePath.startsWith(UPLOAD_ROOT)) {
                Files.deleteIfExists(filePath);
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete image file");
        }

        carImageService.deleteImage(imageId);
        return ResponseEntity.ok("Image deleted successfully");
    }

    /* =============== Helpers =============== */
    private CarAd getAdOr404(Long id) {
        try { return carAdService.getAdById(id); }
        catch (IllegalArgumentException e) { return null; }
    }

    private ResponseEntity<?> validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) return ResponseEntity.badRequest().body("❌ Empty file provided.");
        if (file.getSize() > MAX_BYTES_PER_FILE) return ResponseEntity.badRequest().body("❌ File exceeds 5MB limit.");
        String ct = file.getContentType();
        if (ct == null || !ALLOWED_CONTENT_TYPES.contains(ct.toLowerCase())) {
            return ResponseEntity.badRequest().body("❌ Unsupported file type. Allowed: JPEG/PNG/WebP/GIF.");
        }
        try {
            BufferedImage img = ImageIO.read(file.getInputStream());
            if (img == null) return ResponseEntity.badRequest().body("❌ File is not a valid image.");
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("❌ Could not read image data.");
        }
        return null;
    }

    private String saveOneImage(CarAd ad, MultipartFile file) {
        // --- derive a real extension ---
        String originalName = Optional.ofNullable(file.getOriginalFilename()).orElse("");
        String ext = StringUtils.getFilenameExtension(originalName);

        if (ext == null || ext.isBlank()) {
            String ct = Optional.ofNullable(file.getContentType()).orElse("").toLowerCase();
            switch (ct) {
                case "image/jpeg":
                case "image/jpg":  ext = "jpg";  break;
                case "image/png":  ext = "png";  break;
                case "image/webp": ext = "webp"; break;
                case "image/gif":  ext = "gif";  break;
                default:           ext = "img";  // safe fallback
            }
        }

        String uniqueName = UUID.randomUUID().toString() + "." + ext.toLowerCase();

        Path target = UPLOAD_ROOT.resolve(uniqueName).normalize();
        if (!target.startsWith(UPLOAD_ROOT)) return null;

        try {
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            return null;
        }

        // Store the API URL in DB so the FE can load /api/images/<filename>
        String apiUrl = "/api/images/" + uniqueName;

        CarImage img = new CarImage(ad, apiUrl);
        carImageService.saveImage(img);
        return img.getImageUrl();
    }

    private void deletePhysicalByUrl(String imageUrl) {
        String filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
        try {
            Path filePath = UPLOAD_ROOT.resolve(filename).normalize();
            if (filePath.startsWith(UPLOAD_ROOT)) {
                Files.deleteIfExists(filePath);
            }
        } catch (IOException ignored) {}
    }

    private void deleteDbByUrl(String imageUrl) {
        // optional rollback hook
    }
}
