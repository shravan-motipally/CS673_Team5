package com.qbot.answeringservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@EnableConfigurationProperties
@SpringBootApplication
@EnableMongoRepositories
public class AnsweringServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AnsweringServiceApplication.class, args);
	}

}
