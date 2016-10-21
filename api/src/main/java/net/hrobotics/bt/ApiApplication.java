package net.hrobotics.bt;

import net.hrobotics.bt.data.Storage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@EnableAutoConfiguration
@SpringBootApplication
public class ApiApplication {
    @Autowired
    private Storage storage;

    @RequestMapping("/")
    @ResponseBody
    public String home() {
        return storage == null ? "NULL" : storage.toString();
    }

    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
    }
}
