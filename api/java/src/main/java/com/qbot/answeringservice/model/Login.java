package com.qbot.answeringservice.model;

import org.mongojack.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;

@Getter
@Document(collection = "login")
public class Login {

    @Id
    private final String id;
    private final String userName;
    private final String saltedHash;

    public Login(String id, String userName, String saltedHash) {
        this.id = id;
        this.userName = userName;
        this.saltedHash = saltedHash;
    }
}
