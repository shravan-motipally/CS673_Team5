package com.qbot.answeringservice.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.qbot.answeringservice.model.User;
import com.qbot.answeringservice.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    public User createUser(User user) {
        if (user.getId() == null) {
            user.setId(UUID.randomUUID());
        }
        return userRepo.save(user);
    }

    public List<User> findAllUsers() {
        return userRepo.findAll();
    }

    public User findByLoginId(UUID loginId) {
        return userRepo.findUserByLoginId(loginId);
    }

    public User findByUserId(UUID userId) {
        return userRepo.findById(userId).orElse(null);
    }

    public List<User> findByRoleId(String roleId) {
        return userRepo.findUsersByRole(roleId);
    }

    public User updateUser(User user) {
        return userRepo.save(user);
    }

    public void deleteUser(UUID userId) throws IllegalArgumentException {
        if (userId != null) {
            userRepo.deleteById(userId);
        }
    }

}
