package com.qbot.answeringservice.repository;

import com.qbot.answeringservice.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.UUID;

public interface UserRepository extends MongoRepository<User, UUID> {

    @Query("{loginId:'?0'}")
    User findUserByLoginId(UUID loginId);
}
