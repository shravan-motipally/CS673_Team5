package com.qbot.answeringservice.model;

import org.mongojack.Id;
import org.mongojack.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@Document(collection = "user")
public class User {

    @Id
    private UUID id;
    private String photoUrl;
    private UUID loginId;
    private String firstName;
    private String lastName;
    @ObjectId
    private final List<String> roleIds;
    @ObjectId
    private final List<String> courseIds;
}