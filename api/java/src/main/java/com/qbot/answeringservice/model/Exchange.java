package com.qbot.answeringservice.model;

import org.mongojack.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Document(collection = "exchange")
public class Exchange {
    @Id
    private String id;
    @Setter
    private String courseId;
    private String question;
    private String answer;

    public Exchange(String id, String courseId, String question, String answer) {
        this.id = id;
        this.courseId = courseId;
        this.question = question;
        this.answer = answer;
    }
}
