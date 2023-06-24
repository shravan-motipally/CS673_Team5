package com.qbot.answeringservice.dto;


public class QbotResponse {
    private final String question;
    private final String answer;

    public QbotResponse(String question, String answer) {
        this.question = question;
        this.answer = answer;
    }

    public String getQuestion() {
        return question;
    }

    public String getAnswer() {
        return answer;
    }
}
