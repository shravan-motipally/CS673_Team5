package com.qbot.answeringservice.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.qbot.answeringservice.model.Login;

public interface LoginRepository extends MongoRepository<Login, String> {

    @Query("{userName:'?0'}")
    Login findLoginByUserName(String userName);
}
