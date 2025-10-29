package albcars.project.services;

import albcars.project.services.CarAdService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class CarAdScheduler {

    @Autowired
    private CarAdService carAdService;

    // This method will run every day at midnight and delete expired ads
    @Scheduled(cron = "0 0 0 * * ?")
    public void deleteExpiredAdsTask() {
        carAdService.deleteExpiredAds();
    }
}
