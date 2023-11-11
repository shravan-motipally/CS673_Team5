package com.qbot.answeringservice.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class LoginResponse {
    private final String firstName;
    private final String lastName;
    private final String photoUrl;
    private final List<String> roles;

    public LoginResponse(String firstName, String lastName, String photoUrl, List<String> roles) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.photoUrl = photoUrl;
        this.roles = roles;
    }
}
