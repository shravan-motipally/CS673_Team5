package com.qbot.answeringservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;

import java.util.UUID;

@Getter
@Document(collection = "login")
public class Login {

    @Id
    private final UUID id;
    private final String userName;
    private final String saltedHash;

    public Login(UUID id, String userName, String saltedHash) {
        this.id = id;
        this.userName = userName;
        this.saltedHash = saltedHash;
    }
}
