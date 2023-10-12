package com.qbot.answeringservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;

import static org.apache.logging.log4j.util.Strings.isEmpty;

@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
public class QbotRequest {
    private String question;
    private String context;
    private int threshold;

    public QbotRequest(String question, String context, int threshold) {
        this.question = question;
        this.context = context;
        this.threshold = threshold;
    }

    public static boolean validateRequest(QbotRequest request) {
        return !isEmpty(request.getQuestion());
    }
}
