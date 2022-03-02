FROM openjdk:12
COPY /target/gateway-0.0.1-SNAPSHOT.jar /opt/gateway.jar
VOLUME /tmp
EXPOSE 8099
CMD java -jar /opt/gateway.jar