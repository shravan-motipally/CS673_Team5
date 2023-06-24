# Answering Service

This is built with Java 11 + Spring Boot with the following modules

- Spring MVC
- Spring Data MongoDB
- Spring Oauth2
- Spring Security

## Database

Connecting with MongoDB requires that you set an environment variable MONGO_DB_PW
whenever you run the application.

## Locally running the application

```bash
$ mvn clean install -DskipTests
$ MONGO_DB_PW=<ask> mvn spring-boot:run 
```

If you don't have maven or java isn't set up locally (or other java/mvn issues come up, 
set up Docker and run.  Need help setting up docker?
- go [here](https://docs.docker.com/desktop/install/windows-install/) for windows
- go [here](https://docs.docker.com/desktop/install/mac-install/) for mac

```bash
$ docker build -t answeringsvc .
$ docker run -e MONGO_DB_PW=<ask> answeringsvc
```