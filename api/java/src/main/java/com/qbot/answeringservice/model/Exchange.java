package com.qbot.answeringservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Document(collection = "exchange")
public class Exchange {
    @Id
    private String exchangeId;
    @Setter
    private String courseId;
    private String question;
    private String answer;

    public Exchange(String exchangeId, String courseId, String question, String answer) {
        this.exchangeId = exchangeId;
        this.courseId = courseId;
        this.question = question;
        this.answer = answer;
    }
}
