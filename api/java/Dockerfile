FROM maven:3.8.2-jdk-11 as build
ARG MONGO_DB_PW

COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:11-jdk-slim

COPY --from=build /target/answering-service-0.0.1-SNAPSHOT.jar answering-service.jar


EXPOSE 8080
ENTRYPOINT ["java", "-jar", "answering-service.jar"]