package com.qbot.answeringservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;

@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
public class LoginDetail {
    private String username;
    private String password;

    public LoginDetail(String username, String password) {
        this.username = username;
        this.password = password;
    }
}
