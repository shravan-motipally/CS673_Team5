package com.qbot.answeringservice.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import org.apache.commons.validator.routines.EmailValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.qbot.answeringservice.dto.LoginDetail;
import com.qbot.answeringservice.dto.UserRequest;
import com.qbot.answeringservice.dto.UserResponse;
import com.qbot.answeringservice.model.Login;
import com.qbot.answeringservice.model.User;
import com.qbot.answeringservice.repository.UserRepository;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private LoginService loginService;

    private EmailValidator emailValidator;

    @Autowired
    private UserRepository userRepo;

    public UserService() {
        this.emailValidator = EmailValidator.getInstance();
    }

    public UserResponse createUser(UserRequest userRequest) {
        if (userRequest.getId() == null) {
            userRequest.setId(UUID.randomUUID().toString());
        }

        String validationResults = validateUserRequest(userRequest);
        if (validationResults == null || validationResults.length() == 0) {
            LoginDetail userLoginDetail = userRequest.getLoginDetail();
            String usernameValue = userLoginDetail.getUsername() != null ? userRequest.getLoginDetail().getUsername()
                    : userRequest.getEmailAddress();
            Login login = loginService.createLogin(usernameValue, userLoginDetail.getPassword());
            if (login != null) {
                User userEntity = User.fromUserRequest(userRequest);
                userEntity.setLoginId(login.getId());
                User createdUser = userRepo.save(userEntity);
                return UserResponse.convertFromEntity(createdUser, login);
            } else {
                logger.error("Login service error when creating new user credentials");
                return null;
            }
        } else {
            logger.info("Validation failure(s) when creating new user:\n {}", validationResults);
            return null;
        }
    }

    public List<User> findAllUsers() {
        return userRepo.findAll();
    }

    public User findByLoginId(String loginId) {
        return userRepo.findUserByLoginId(loginId);
    }

    public User findByUserId(String userId) {
        return userRepo.findById(userId).orElse(null);
    }

    public List<User> findByRoleId(String roleId) {
        return userRepo.findUsersByRole(roleId);
    }

    public User updateUser(User user) {
        return validateUser(user) ? userRepo.save(user) : null;
    }

    public List<User> bulkUpdateUsers(List<User> users) {
        List<User> validatedUsers = new ArrayList<>();
        for (User user : users) {
            if (userRepo.existsById(user.getId()) && validateUser(user)) {
                validatedUsers.add(user);
            }
        }

        if (!validatedUsers.isEmpty()) {
            return userRepo.saveAll(validatedUsers);
        } else {
            return Collections.emptyList();
        }
    }

    private boolean validateUser(User user) {
        if (user.getLoginId() == null || user.getLoginId().isEmpty()) {
            return false;
        } else if (user.getFirstName() == null || user.getFirstName().isEmpty()) {
            return false;
        } else if (user.getLastName() == null || user.getLastName().isEmpty()) {
            return false;
        } else if (user.getEmailAddress() == null || user.getEmailAddress().isEmpty()) {
            return false;
        } else if (user.getRoleIds() == null || user.getRoleIds().isEmpty()) {
            return false;
        }
        return true;
    }

    public void deleteUser(String userId) {
        if (userId != null) {
            userRepo.deleteById(userId);
        }
    }

    private String validateUserRequest(UserRequest userRequest) {
        StringBuilder builder = new StringBuilder();

        if (this.emailValidator == null) {
            builder.append("Email validation service is missing");
            logger.error("Email validation service cannot be instantiated");
        } else if (userRequest.getEmailAddress() == null
                || !this.emailValidator.isValid(userRequest.getEmailAddress())) {
            builder.append("Email Address is invalid/missing\n");
        }

        LoginDetail loginDetail = userRequest.getLoginDetail();
        if (loginDetail == null || loginDetail.getPassword() == null) {
            builder.append("Login Credentials are invalid/missing\n");
        }

        return builder.toString();
    }

}
