package com.qbot.answeringservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "exchange")
public class Exchange {
    @Id
    private String exchangeId;
    private String question;
    private String answer;

    private Double[] embeddings;

    public Exchange(String exchangeId, String question, String answer,Double[] embeddings) {
        this.exchangeId = exchangeId;
        this.question = question;
        this.answer = answer;
        this.embeddings = embeddings;
    }

    public String getExchangeId() {
        return exchangeId;
    }

    public String getQuestion() {
        return question;
    }

    public String getAnswer() {
        return answer;
    }

    public Double[] getEmbeddings() { return embeddings; }
}
