package com.qbot.answeringservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Exchange {
    @Id
    private String id;
    private String question;
    private String answer;

    public Exchange(String id, String text, String answerId) {
        this.id = id;
        this.question = text;
        this.answer = answerId;
    }

    public String getQuestion() {
        return question;
    }

    public String getAnswer() {
        return answer;
    }
}
