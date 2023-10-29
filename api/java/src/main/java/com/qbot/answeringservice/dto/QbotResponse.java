package com.qbot.answeringservice.dto;

import lombok.Getter;

@Getter
public class QbotResponse {
    private final String question;
    private final String answer;

    public QbotResponse(String question, String answer) {
        this.question = question;
        this.answer = answer;
    }
}
