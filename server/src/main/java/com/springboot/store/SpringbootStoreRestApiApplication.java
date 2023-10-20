package com.springboot.store;

import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableEncryptableProperties
public class SpringbootStoreRestApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringbootStoreRestApiApplication.class, args);
	}

}
