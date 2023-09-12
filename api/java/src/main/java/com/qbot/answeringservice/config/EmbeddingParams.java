package com.qbot.answeringservice.config;

public class EmbeddingParams {

    private final String embeddingToken;
    private final String embeddingUrl;


    public EmbeddingParams(String embeddingToken, String embeddingUrl) {
        this.embeddingToken = embeddingToken;
        this.embeddingUrl = embeddingUrl;
    }

    public String getEmbeddingToken() {
        return embeddingToken;
    }

    public String getEmbeddingUrl() {
        return embeddingUrl;
    }
}
