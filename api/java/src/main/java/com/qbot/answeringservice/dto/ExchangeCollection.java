package com.qbot.answeringservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.qbot.answeringservice.model.Exchange;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ExchangeCollection {

    private String courseId;
    private long numOfQuestions;
    private List<Exchange> exchanges;

    public ExchangeCollection(String courseId, long numOfQuestions, List<Exchange> exchanges) {
        this.courseId = courseId;
        this.numOfQuestions = numOfQuestions;
        this.exchanges = exchanges;
    }
}
