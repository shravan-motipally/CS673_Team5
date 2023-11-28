package com.qbot.answeringservice.dto;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import com.mongodb.lang.NonNull;
import com.qbot.answeringservice.model.Role;
import com.qbot.answeringservice.model.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String photoUrl;
    private String username;
    private String emailAddess;
    private String firstName;
    private String lastName;
    private List<String> roleNames;
    private List<String> courseIds;

    public static UserResponse convertFromEntity(@NonNull User userEntity, String username) {
        UserResponse dto = new UserResponse();
        dto.setId(userEntity.getId());
        dto.setPhotoUrl(userEntity.getPhotoUrl());
        dto.setUsername(username);
        dto.setEmailAddess(userEntity.getEmailAddress() != null ? userEntity.getEmailAddress() : "");
        dto.setFirstName(userEntity.getFirstName());
        dto.setLastName(userEntity.getLastName());
        dto.setCourseIds(userEntity.getCourseIds() != null ? userEntity.getCourseIds() : Collections.emptyList());

        List<String> roleNames = userEntity.getRoleIds() != null
                ? userEntity.getRoleIds().stream().map(Role::getRoleNameById).collect(Collectors.toList())
                : Collections.emptyList();
        dto.setRoleNames(roleNames);
        return dto;
    }
}
