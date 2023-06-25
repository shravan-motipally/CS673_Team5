package com.qbot.answeringservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories
public class AnsweringServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AnsweringServiceApplication.class, args);
	}

}
