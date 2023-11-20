package com.qbot.answeringservice.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.qbot.answeringservice.dto.UserRequest;
import com.qbot.answeringservice.dto.UserResponse;
import com.qbot.answeringservice.model.User;
import com.qbot.answeringservice.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {
    private final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserResponse> createUser(@RequestBody UserRequest user) {
        try {
            return ResponseEntity.ok(userService.createUser(user));
        } catch (Exception e) {
            logger.error("Server error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<User>> getAllUsers() {
        try {
            return ResponseEntity.ok(userService.findAllUsers());
        } catch (Exception e) {
            logger.error("Server error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping(path = "/login/{loginId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<User> getUserByLoginId(@PathVariable("loginId") String loginId) {
        try {
            return ResponseEntity.ok(userService.findByLoginId(loginId));
        } catch (Exception e) {
            logger.error("Server error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping(path = "/role/{roleId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<User>> getUsersByRoleId(@PathVariable("roleId") String roleId) {
        try {
            return ResponseEntity.ok(userService.findByRoleId(roleId));
        } catch (Exception e) {
            logger.error("Server error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<User> updateUser(@RequestBody User user) {
        try {
            return ResponseEntity.ok(userService.updateUser(user));
        } catch (Exception e) {
            logger.error("Server error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping(path = "/bulkupdate", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<User>> bulkUpdateUsers(@RequestBody List<User> users) {
        try {
            List<User> updateResults = userService.bulkUpdateUsers(users);
            if (updateResults == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            } else if (updateResults.isEmpty()) {
                return ResponseEntity.badRequest().build();
            } else {
                return ResponseEntity.ok(updateResults);
            }
        } catch (Exception e) {
            logger.error("Server error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping(path = "/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> deleteUser(@PathVariable("userId") String userId) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            logger.error("Server error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

    }
}
