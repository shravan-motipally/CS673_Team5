package com.qbot.answeringservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Document
public class User {

    @Id
    private final UUID id;
    private final String photoUrl;
    private final UUID loginId;

    public User(UUID id, String photoUrl, UUID loginId) {
        this.id = id;
        this.photoUrl = photoUrl;
        this.loginId = loginId;
    }
}
