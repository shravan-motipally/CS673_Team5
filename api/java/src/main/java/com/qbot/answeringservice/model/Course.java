package com.qbot.answeringservice.model;

import org.mongojack.Id;
import org.mongojack.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Document(collection = "course")
public class Course {
    @Id
    @ObjectId
    private String id;
    private String SchoolId;
    private String departmentId;
    private String catalogId;
    private String name;
    private String description;
    private String semester;
}
