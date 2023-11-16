package com.qbot.answeringservice.dto;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import com.qbot.answeringservice.model.Login;
import com.qbot.answeringservice.model.Role;
import com.qbot.answeringservice.model.User;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponse {
    private String id;
    private String photoUrl;
    private Login login;
    private String firstName;
    private String lastName;
    private List<String> roleNames;
    private List<String> courseIds;

    public static UserResponse convertFromEntity(User userEntity, Login loginEntity) {
        UserResponse dto = new UserResponse();
        dto.setId(userEntity.getId());
        dto.setPhotoUrl(userEntity.getPhotoUrl());
        dto.setLogin(loginEntity);
        dto.setFirstName(userEntity.getFirstName());
        dto.setLastName(userEntity.getLastName());
        dto.setCourseIds(userEntity.getCourseIds());

        List<String> roleNames = userEntity.getRoleIds() != null
                ? userEntity.getRoleIds().stream().map(Role::getRoleNameById).collect(Collectors.toList())
                : Collections.emptyList();
        dto.setRoleNames(roleNames);
        return dto;
    }
}
