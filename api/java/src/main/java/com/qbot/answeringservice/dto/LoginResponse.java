package com.qbot.answeringservice.dto;

import lombok.Getter;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import com.qbot.answeringservice.model.Role;
import com.qbot.answeringservice.model.User;

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

    public static LoginResponse fromUser(User user) {
        List<String> roleNames = user.getRoleIds() != null
                ? user.getRoleIds().stream().map(Role::getRoleNameById).collect(Collectors.toList())
                : Collections.emptyList();
        return new LoginResponse(user.getFirstName(), user.getLastName(), user.getPhotoUrl(), roleNames);
    }
}
