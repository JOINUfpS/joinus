FROM openjdk:12
COPY /target/eureka-0.0.1-SNAPSHOT.jar /opt/eureka.jar
VOLUME /tmp
EXPOSE 8090
CMD java -jar /opt/eureka.jar