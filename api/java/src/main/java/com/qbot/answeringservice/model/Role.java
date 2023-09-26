package com.qbot.answeringservice.model;

import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Document(collection = "role")
public class Role {
    @Id
    private final UUID id;
    private final String name;
    private final String description;
}
