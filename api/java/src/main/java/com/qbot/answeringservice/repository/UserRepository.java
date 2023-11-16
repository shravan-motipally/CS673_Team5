package com.qbot.answeringservice.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.qbot.answeringservice.model.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    @Query("{ loginId: '?0' }")
    User findUserByLoginId(String loginId);

    @Query("{ roleIds: '?0' }")
    List<User> findUsersByRole(String roleId);
}
