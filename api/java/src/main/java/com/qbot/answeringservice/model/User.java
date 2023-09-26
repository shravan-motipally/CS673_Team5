package com.qbot.answeringservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;

import java.util.UUID;

@Getter
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
}
