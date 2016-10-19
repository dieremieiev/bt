CREATE KEYSPACE btkeyspace WITH REPLICATION = { 'class': 'SimpleStrategy', 'replication_factor': 1 };
CREATE TABLE btkeyspace.user(userid UUID PRIMARY KEY,data TEXT);
CREATE TABLE btkeyspace.useremail(email TEXT PRIMARY KEY,userid UUID);
CREATE TABLE btkeyspace.userbot(userid UUID,botid UUID,data TEXT,PRIMARY KEY(userid,botid));
CREATE TABLE btkeyspace.usermessage(date TIMESTAMP,userid UUID,messageid TIMEUUID,data TEXT,PRIMARY KEY(date,userid,messageid));
