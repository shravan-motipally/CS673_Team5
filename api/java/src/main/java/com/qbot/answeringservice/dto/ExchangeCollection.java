package com.qbot.answeringservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.qbot.answeringservice.model.Exchange;

import lombok.Getter;

import java.util.List;

@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ExchangeCollection {

    private final String courseId;
    private final long numOfQuestions;
    private final List<Exchange> exchanges;

    public ExchangeCollection(String courseId, long numOfQuestions, List<Exchange> exchanges) {
        this.courseId = courseId;
        this.numOfQuestions = numOfQuestions;
        this.exchanges = exchanges;
    }
}
