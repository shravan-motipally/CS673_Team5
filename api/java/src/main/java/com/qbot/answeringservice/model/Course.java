package com.qbot.answeringservice.model;

import java.util.List;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Document(collection = "course")
public class Course {
    @Id
    private final UUID id;
    private final String name;
    private final List<User> instructors;
}
