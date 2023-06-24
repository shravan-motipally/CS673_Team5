package com.qbot.answeringservice.service;

import com.qbot.answeringservice.dto.AllExchanges;
import com.qbot.answeringservice.model.Exchange;
import com.qbot.answeringservice.repository.ExchangeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class AnsweringService {

    private final Logger logger = LoggerFactory.getLogger(AnsweringService.class);
    private final ExchangeRepository repository;

    @Autowired
    public AnsweringService(ExchangeRepository repository) {
        this.repository = repository;
    }

    public AllExchanges getAllExchanges() {
        long count = repository.count();
        if (count > 0) {
            List<Exchange> exchanges = repository.findAll();
            return new AllExchanges(count, exchanges);
        }
        return new AllExchanges(0L, Collections.emptyList());
    }

    public boolean saveExchanges(AllExchanges exchanges) {
        if (exchanges.getNumOfQuestions() == 0) {
            return true;
        }
        try {
            repository.saveAll(exchanges.getExchanges());
        } catch (Exception e) {
            logger.error("Error storing exchanges: error message: " + e.getMessage());
            return false;
        }
        return true;
    }
}
