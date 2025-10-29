package albcars.project.controllers;

import albcars.project.services.CarDealershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/dealerships")
public class CarDealershipController {

    @Autowired
    private CarDealershipService carDealershipService;

    @PatchMapping("/update-contact")
    public ResponseEntity<?> updateDealershipContact(
            @RequestBody Map<String, String> updates,
            Principal principal
    ) {
        String currentEmail = principal.getName(); // From JWT
        String newEmail = updates.get("email");
        String newPhone = updates.get("phoneNumber");

        if (newEmail == null || newPhone == null) {
            return ResponseEntity.badRequest().body("Missing required fields: email or phoneNumber.");
        }

        try {
            carDealershipService.updateContactInfo(currentEmail, newEmail, newPhone);
            return ResponseEntity.ok("Dealership contact info updated successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to update dealership contact information.");
        }
    }
}
