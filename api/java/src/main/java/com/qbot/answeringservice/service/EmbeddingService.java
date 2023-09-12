package com.qbot.answeringservice.service;

import com.qbot.answeringservice.config.EmbeddingParams;
import com.qbot.answeringservice.repository.ExchangeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmbeddingService {

    private static final Logger logger = LoggerFactory.getLogger(EmbeddingService.class);
    private final ExchangeRepository exchangeRepository;
    private final EmbeddingParams embeddingParams;

    @Autowired
    public EmbeddingService(ExchangeRepository exchangeRepository, EmbeddingParams embeddingParams) {
        this.exchangeRepository = exchangeRepository;
        this.embeddingParams = embeddingParams;
    }

//    public void
}
