package com.qbot.answeringservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Document(collection = "user")
public class User {

    @Id
    private final UUID id;
    private final String photoUrl;
    private final UUID loginId;
    private final String firstName;
    private final String lastName;

    public User(UUID id, String photoUrl, UUID loginId, String firstName, String lastName) {
        this.id = id;
        this.photoUrl = photoUrl;
        this.loginId = loginId;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public UUID getLoginId() {
        return loginId;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }
}
