package com.qbot.answeringservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Document(collection = "login")
public class Login {

    @Id
    private final UUID loginId;
    private final String userName;
    private final String saltedHash;

    public Login(UUID loginId, String userName, String saltedHash) {
        this.loginId = loginId;
        this.userName = userName;
        this.saltedHash = saltedHash;
    }

    public UUID getLoginId() {
        return loginId;
    }

    public String getSaltedHash() {
        return saltedHash;
    }

    public String getUserName() {
        return userName;
    }
}
