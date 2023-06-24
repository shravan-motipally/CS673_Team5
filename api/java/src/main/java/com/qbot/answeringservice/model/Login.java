package com.qbot.answeringservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Document
public class Login {

    @Id
    private final UUID loginId;
    private final String userName;
    private final String saltedHash;
    private final String salt;

    public Login(UUID loginId, String userName, String saltedHash, String salt) {
        this.loginId = loginId;
        this.userName = userName;
        this.saltedHash = saltedHash;
        this.salt = salt;
    }
}
