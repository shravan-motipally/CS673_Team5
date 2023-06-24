package com.qbot.answeringservice.repository;


import com.qbot.answeringservice.model.Exchange;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

@Repository
public interface ExchangeRepository extends MongoRepository<Exchange, String> {

    @Query("{question:'?0'}")
    Exchange findExchangeByQuestion(String question);
}
