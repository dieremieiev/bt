package net.hrobotics.bt;

import com.datastax.driver.core.*;
import com.datastax.driver.core.querybuilder.QueryBuilder;
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
    @RequestMapping("/")
    @ResponseBody
    public String home() {
        try (Cluster cluster = Cluster.builder().addContactPoint("127.0.0.1").build();
             Session session = cluster.connect("btkeyspace"))
        {
//            ResultSet rs = session.execute("select release_version from system.local");
//            Row row = rs.one();
//            return row.getString("release_version");

            String email = "test@aaa.bbb";

            insertUserEmail(session, email, UUID.randomUUID());

            UUID uuid = selectUserEmail(session, email);

//            updateUserEmail(session, email, UUID.randomUUID());

//            deleteUserEmail(session, email);

            return uuid.toString();
        }
    }

    private void deleteUserEmail(Session session, String email) {
        Statement delete = QueryBuilder.delete().from("useremail").where(QueryBuilder.eq("email", email));

        session.execute(delete);
    }

    private void insertUserEmail(Session session, String email, UUID uuid) {
        Statement insert = QueryBuilder.insertInto("useremail").value("email", email).value("uuid", uuid);

        session.execute(insert);
    }

    private UUID selectUserEmail(Session session, String email) {
        Statement select = QueryBuilder.select().all().from("useremail").where(QueryBuilder.eq("email", email));

        ResultSet rs = session.execute(select);
        Row row = rs.one();
        return row.getUUID("uuid");
    }

    private void updateUserEmail(Session session, String email, UUID uuid) {
        Statement update = QueryBuilder.update("useremail").with(QueryBuilder.set("uuid", uuid)).where(QueryBuilder.eq("email", email));

        session.execute(update);
    }

    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
    }
}
