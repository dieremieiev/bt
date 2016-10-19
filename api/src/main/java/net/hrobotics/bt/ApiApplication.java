package net.hrobotics.bt;

import com.datastax.driver.core.Cluster;
import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Row;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
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
        try (Cluster cluster = Cluster.builder().addContactPoint(LOCALHOSTIP).build();
             Session session = cluster.connect(KEYSPACE))
        {
//            ResultSet rs = session.execute("select release_version from system.local");
//            Row row = rs.one();
//            return row.getString("release_version");

            String email = "test@aaa.bbb";

            insertUserEmail(session, email, UUID.randomUUID());

            UUID uuid = selectUserEmail(session, email);

//            updateUserEmail(session, email, KEY_UUID.randomUUID());

//            deleteUserEmail(session, email);

            return uuid.toString();
        }
    }

    private void deleteUserEmail(Session session, String email) {
        Statement delete = QueryBuilder.delete().from(KEY_USEREMAIL).where(QueryBuilder.eq(KEY_EMAIL, email));

        session.execute(delete);
    }

    private void insertUserEmail(Session session, String email, UUID uuid) {
        Statement insert = QueryBuilder.insertInto(KEY_USEREMAIL).value(KEY_EMAIL, email).value(KEY_UUID, uuid);

        session.execute(insert);
    }

    private UUID selectUserEmail(Session session, String email) {
        Statement select = QueryBuilder.select().all().from(KEY_USEREMAIL).where(QueryBuilder.eq(KEY_EMAIL, email));

        ResultSet rs = session.execute(select);
        Row row = rs.one();
        return row.getUUID(KEY_UUID);
    }

    private void updateUserEmail(Session session, String email, UUID uuid) {
        Statement update = QueryBuilder.update(KEY_USEREMAIL).with(QueryBuilder.set(KEY_UUID, uuid))
                                       .where(QueryBuilder.eq(KEY_EMAIL, email));

        session.execute(update);
    }

    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
    }

    private static final String LOCALHOSTIP   = "127.0.0.1";
    private static final String KEYSPACE      = "btkeyspace";

    private static final String KEY_EMAIL     = "email";
    private static final String KEY_USEREMAIL = "useremail";
    private static final String KEY_UUID      = "uuid";
}
