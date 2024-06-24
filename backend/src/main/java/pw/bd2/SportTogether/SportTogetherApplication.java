package pw.bd2.SportTogether;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@SpringBootApplication
@EnableWebMvc
public class SportTogetherApplication {

	public static void main(String[] args) {
		SpringApplication.run(SportTogetherApplication.class, args);
	}

}
