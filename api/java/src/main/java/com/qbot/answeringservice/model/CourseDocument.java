package com.qbot.answeringservice.model;

import org.mongojack.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "document")
public class CourseDocument {
    @Id
    private Long id;
    private String name;
    private String text;
    private float[] embeddings;
    private String courseId;
    private int pageNumber;

    @Transient
    public static final String DOCUMENT_SEQUENCE = "document_sequence";

    public CourseDocument(Long id, String name, String text, float[] embeddings, String courseId, int pageNumber) {
        this.id = id;
        this.name = name;
        this.text = text;
        this.embeddings = embeddings;
        this.courseId = courseId;
        this.pageNumber = pageNumber;
    }
}