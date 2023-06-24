package com.qbot.answeringservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.qbot.answeringservice.model.Exchange;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AllExchanges {

    private final long numOfQuestions;
    private final List<Exchange> exchanges;

    public AllExchanges(long numOfQuestions, List<Exchange> exchanges) {
        this.numOfQuestions = numOfQuestions;
        this.exchanges = exchanges;
    }

    public List<Exchange> getExchanges() {
        return exchanges;
    }

    public long getNumOfQuestions() {
        return numOfQuestions;
    }
}
