package com.qbot.answeringservice.model;

import org.mongojack.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Document(collection = "login")
public class Login {

    @Id
    private final String id;
    @Setter
    private String userName;
    @Setter
    private String saltedHash;

    public Login(String id, String userName, String saltedHash) {
        this.id = id;
        this.userName = userName;
        this.saltedHash = saltedHash;
    }
}
