package com.qbot.answeringservice.repository;

import com.qbot.answeringservice.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.UUID;

public interface UserRepository extends MongoRepository<User, UUID> {
}
