package com.qbot.answeringservice.repository;

import com.qbot.answeringservice.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserRepository extends MongoRepository<User, UUID> {

    @Query("{ loginId: '?0' }")
    User findUserByLoginId(UUID loginId);

    @Query("{ roleIds: ObjectId('?0') }")
    List<User> findUsersByRole(String roleId);
}
