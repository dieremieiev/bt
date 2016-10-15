CREATE KEYSPACE btkeyspace WITH REPLICATION = { 'class': 'SimpleStrategy', 'replication_factor': 1 };
CREATE TABLE btkeyspace.user(uuid UUID PRIMARY KEY,data TEXT);
CREATE TABLE btkeyspace.useremail(email TEXT PRIMARY KEY,uuid UUID);
