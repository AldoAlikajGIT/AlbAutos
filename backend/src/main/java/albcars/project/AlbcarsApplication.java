package albcars.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class AlbcarsApplication {

	public static void main(String[] args) {
		SpringApplication.run(AlbcarsApplication.class, args);
	}

}
