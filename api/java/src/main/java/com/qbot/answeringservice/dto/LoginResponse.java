package com.qbot.answeringservice.dto;

public class LoginResponse {
    private String firstName;
    private String lastName;
    private String photoUrl;

    public LoginResponse(String firstName, String lastName, String photoUrl) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.photoUrl = photoUrl;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }
}
