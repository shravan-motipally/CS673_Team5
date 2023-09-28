package com.qbot.answeringservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;
import java.util.UUID;

@Getter
@AllArgsConstructor
@Document(collection = "user")
public class User {

    @Id
    private final UUID id;
    private final String photoUrl;
    private final UUID loginId;
    private final String firstName;
    private final String lastName;
    private final List<Role> roles;
}
