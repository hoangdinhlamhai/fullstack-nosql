package com.example.MobileStoreManagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

// @SpringBootApplication
@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class MobileStoreManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(MobileStoreManagementApplication.class, args);
	}

}
