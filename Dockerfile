FROM bt-ubuntu-java8:latest

COPY api/build/libs/api-0.0.1-SNAPSHOT.jar /data/

ENV JAVA_HOME /usr/lib/jvm/java-8-oracle

CMD ["java", "-jar", "/data/api-0.0.1-SNAPSHOT.jar"]
