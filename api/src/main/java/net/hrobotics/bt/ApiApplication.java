package net.hrobotics.bt;

import net.hrobotics.bt.data.Storage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.UUID;

@Controller
@EnableAutoConfiguration
@SpringBootApplication
public class ApiApplication {
    @Autowired
    private Storage storage;

    @RequestMapping("/")
    @ResponseBody
    public String home() {
        return test();
    }

    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
    }

    private String test() {
        String email = "test@aaa.bbb";

        UUID uuid = storage.selectUserEmail(email);

        boolean b = uuid == null;

        if (b) {
            storage.insertUserEmail(email, UUID.randomUUID());

            uuid = storage.selectUserEmail(email);
        }

        return (b ? "INSERTED NEW: " : "EXISTING: ") + (uuid != null ? uuid.toString() : "NULL");
    }
}
