package com.qbot.answeringservice.repository;

import com.qbot.answeringservice.model.Login;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.UUID;

public interface LoginRepository extends MongoRepository<Login, UUID>  {

    @Query("{userName:'?0'}")
    Login findLoginByUserName(String userName);
}
