package com.qbot.answeringservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;

@Getter
@Document(collection = "exchange")
public class Exchange {
    @Id
    private String exchangeId;
    private String question;
    private String answer;

    public Exchange(String exchangeId, String question, String answer) {
        this.exchangeId = exchangeId;
        this.question = question;
        this.answer = answer;
    }
}
