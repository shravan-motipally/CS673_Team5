package com.qbot.answeringservice.model;

import java.util.List;
import java.util.stream.Collector;
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

    public static User fromUserRequest(UserRequest request) {
        return new User(request.getId(), request.getPhotoUrl(), null, request.getEmailAddress(), request.getFirstName(),
                request.getLastName(),
                request.getRoleNames().stream().map(Role::getRoleIdByName).collect(Collectors.toList()),
                request.getCourseIds());
    }
}