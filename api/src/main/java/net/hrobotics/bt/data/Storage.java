package net.hrobotics.bt.data;

import com.datastax.driver.core.Cluster;
import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Row;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.util.UUID;

@Component
public class Storage {
    private Session session;

/*
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
*/
    public Storage() {
        System.out.println("Storage.constructor: " + this);
    }

    @PostConstruct
    public void init() {
        System.out.println("Storage.init - begin");

        Cluster cluster = Cluster.builder().addContactPoint(LOCALHOSTIP).build();

        session = cluster.connect(KEYSPACE);

        System.out.println("Storage.init - end");
    }

    @PreDestroy
    public void destroy() {
        System.out.println("Storage.destroy - begin");

        if (session == null) { return; }

        Cluster cluster = session.getCluster();

        try {
            session.close();
        } catch (Exception e) {
            e.printStackTrace(); // TODO - use logger
        }

        session = null;

        if (cluster == null) { return; }

        try {
            cluster.close();
        } catch (Exception e) {
            e.printStackTrace(); // TODO - use logger
        }

        System.out.println("Storage.destroy - end");
    }

    private void deleteUserEmail(String email) {
        Statement delete = QueryBuilder.delete().from(KEY_USEREMAIL).where(QueryBuilder.eq(KEY_EMAIL, email));

        session.execute(delete);
    }

    private void insertUserEmail(String email, UUID uuid) {
        Statement insert = QueryBuilder.insertInto(KEY_USEREMAIL).value(KEY_EMAIL, email).value(KEY_UUID, uuid);

        session.execute(insert);
    }

    private UUID selectUserEmail(String email) {
        Statement select = QueryBuilder.select().all().from(KEY_USEREMAIL).where(QueryBuilder.eq(KEY_EMAIL, email));

        ResultSet rs = session.execute(select);
        Row row = rs.one();
        return row.getUUID(KEY_UUID);
    }

    private void updateUserEmail(String email, UUID uuid) {
        Statement update = QueryBuilder.update(KEY_USEREMAIL).with(QueryBuilder.set(KEY_UUID, uuid))
                                       .where(QueryBuilder.eq(KEY_EMAIL, email));

        session.execute(update);
    }



    private static final String LOCALHOSTIP   = "127.0.0.1";
    private static final String KEYSPACE      = "btkeyspace";

    private static final String KEY_EMAIL     = "email";
    private static final String KEY_USEREMAIL = "useremail";
    private static final String KEY_UUID      = "uuid";
}
