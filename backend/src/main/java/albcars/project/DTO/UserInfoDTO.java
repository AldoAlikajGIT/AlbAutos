package albcars.project.DTO;

import java.util.List;

public class UserInfoDTO {
    private String email;
    private String phoneNumber;
    private String role;
    private List<CarAdDTO> carAds;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public List<CarAdDTO> getCarAds() {
        return carAds;
    }

    public void setCarAds(List<CarAdDTO> carAds) {
        this.carAds = carAds;
    }
}