package com.qbot.answeringservice.model;

import java.util.List;
import java.util.UUID;

import org.mongojack.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

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
    private List<Integer> roleIds;
    private List<String> courseIds;
}