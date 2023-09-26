package com.qbot.answeringservice.dto;

import lombok.Getter;

@Getter
public class LoginResponse {
    private String firstName;
    private String lastName;
    private String photoUrl;

    public LoginResponse(String firstName, String lastName, String photoUrl) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.photoUrl = photoUrl;
    }
}
