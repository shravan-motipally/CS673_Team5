package com.qbot.answeringservice.model;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.mongojack.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.qbot.answeringservice.dto.UserRequest;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Document(collection = "user")
public class User {

    @Id
    private String id;
    private String photoUrl;
    private String loginId;
    private String emailAddress;
    private String firstName;
    private String lastName;
    private List<Integer> roleIds;
    private List<String> courseIds;

    public static User fromUserRequest(UserRequest request, String loginIdValue) {
        List<String> courseIds = request.getCourseIds() != null ? request.getCourseIds() : Collections.emptyList();
        String loginId = (loginIdValue != null && !loginIdValue.isBlank()) ? loginIdValue : "";
        return new User(request.getId(), request.getPhotoUrl(), loginId, request.getEmailAddress(),
                request.getFirstName(), request.getLastName(),
                request.getRoleNames().stream().map(Role::getRoleIdByName).collect(Collectors.toList()), courseIds);
    }
}