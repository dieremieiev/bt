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

    public Storage() {
        System.out.println("Storage.constructor: " + this);
    }

    @PostConstruct
    public void init() {
        System.out.println("Storage.init - begin");

        String s = System.getenv(BT_CASSANDRA_PORT_9042_TCP_ADDR);

        if (s != null) {
            System.out.println("Storage.init - BT_CASSANDRA_PORT_9042_TCP_ADDR = " + s);

            Cluster cluster = Cluster.builder().addContactPoint(s).build();

            session = cluster.connect(KEYSPACE);
        } else {
            System.out.println("Environment variable BT_CASSANDRA_PORT_9042_TCP_ADDR not determined");

            session = null;
        }

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

    public void deleteUserEmail(String email) {
        if (session == null) { return; }

        Statement delete = QueryBuilder.delete().from(KEY_USEREMAIL).where(QueryBuilder.eq(KEY_EMAIL, email));

        session.execute(delete);
    }

    public void insertUserEmail(String email, UUID uuid) {
        if (session == null) { return; }

        Statement insert = QueryBuilder.insertInto(KEY_USEREMAIL).value(KEY_EMAIL, email).value(KEY_USERID, uuid);

        session.execute(insert);
    }

    public UUID selectUserEmail(String email) {
        if (session == null) { return null; }

        Statement select = QueryBuilder.select().all().from(KEY_USEREMAIL).where(QueryBuilder.eq(KEY_EMAIL, email));

        ResultSet rs = session.execute(select);
        if (rs == null) { return null; }

        Row row = rs.one();
        if (row == null) { return null; }

        return row.getUUID(KEY_USERID);
    }

    public void updateUserEmail(String email, UUID uuid) {
        if (session == null) { return; }

        Statement update = QueryBuilder.update(KEY_USEREMAIL).with(QueryBuilder.set(KEY_USERID, uuid))
                                       .where(QueryBuilder.eq(KEY_EMAIL, email));

        session.execute(update);
    }


    private static final String KEYSPACE      = "btkeyspace";

    private static final String KEY_EMAIL     = "email";
    private static final String KEY_USEREMAIL = "useremail";
    private static final String KEY_USERID    = "userid";

    private static final String BT_CASSANDRA_PORT_9042_TCP_ADDR = "BT_CASSANDRA_PORT_9042_TCP_ADDR";
}
