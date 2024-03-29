package com.qbot.answeringservice.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.qbot.answeringservice.model.Exchange;

@Repository
public interface ExchangeRepository extends MongoRepository<Exchange, String> {

    @Query("{ question: '?0' }")
    Exchange findExchangeByQuestion(String question);

    @Query("{ courseId: '?0' }")
    List<Exchange> findExchangesByCourseId(String courseId);
}
