package com.qbot.answeringservice.model;

import org.mongojack.Id;
import org.mongojack.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Document(collection = "role")
public class Role {
    @Id
    @ObjectId
    private final String id;
    private final String name;
    private final String description;
}
