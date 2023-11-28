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

import lombok.NonNull;

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

        String validationResults = validateUserRequest(userRequest, false);
        if (validationResults == null || validationResults.length() == 0) {
            LoginDetail userLoginDetail = userRequest.getLoginDetail();
            String usernameValue = userLoginDetail.getUsername() != null ? userRequest.getLoginDetail().getUsername()
                    : userRequest.getEmailAddress();
            Login login = loginService.createLogin(usernameValue, userLoginDetail.getPassword());
            if (login != null) {
                User userEntity = User.fromUserRequest(userRequest, login.getId());
                User createdUser = userRepo.save(userEntity);
                return UserResponse.convertFromEntity(createdUser, login.getUserName());
            } else {
                logger.error("Login service error when creating new user credentials");
                return null;
            }
        } else {
            logger.info("Validation failure(s) when creating new user:\n {}", validationResults);
            return null;
        }
    }

    public List<UserResponse> findAllUsers() {
        List<UserResponse> responseList = new ArrayList<>();
        for (User user : userRepo.findAll()) {
            Login userLogin = loginService.getLoginById(user.getLoginId());
            responseList.add(UserResponse.convertFromEntity(user, userLogin.getUserName()));
        }
        return responseList;
    }

    public User findByLoginId(String loginId) {
        return userRepo.findUserByLoginId(loginId);
    }

    public User findByUserId(String userId) {
        return userRepo.findById(userId).orElse(null);
    }

    public List<User> findByRoleId(@NonNull Integer roleId) {
        return userRepo.findUsersByRole(roleId);
    }

    public UserResponse updateUser(UserRequest userRequest) {
        String validationResults = validateUserRequest(userRequest, true);
        if (validationResults == null || validationResults.length() == 0) {
            User existingUserEntity = userRepo.findById(userRequest.getId()).get();
            String loginId = existingUserEntity.getLoginId();
            Login existingLoginEntity = loginService.getLoginById(loginId);
            if (existingLoginEntity != null) {
                String username = existingLoginEntity.getUserName();

                LoginDetail requestLoginDetail = userRequest.getLoginDetail();
                if (requestLoginDetail.getUsername() == null || requestLoginDetail.getUsername().isBlank()) {
                    requestLoginDetail.setUsername(userRequest.getEmailAddress());
                }
                if (loginService.validateLoginDetailForUpdate(requestLoginDetail)) {
                    // update username & password
                    Login updatedLogin = loginService.updateLoginById(existingUserEntity.getLoginId(),
                            requestLoginDetail.getUsername(), requestLoginDetail.getPassword());
                    username = updatedLogin.getUserName();
                }
                // update user entity
                User updatedUser = userRepo.save(User.fromUserRequest(userRequest, loginId));
                return UserResponse.convertFromEntity(updatedUser, username);
            } else {
                logger.error("Login record not found when updating user {}", existingUserEntity.getId());
                return null;
            }
        } else {
            logger.info("Validation failure(s) when updating user:\n {}", validationResults);
            return null;
        }
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
            User existingUser = findByUserId(userId);
            loginService.deleteById(existingUser.getLoginId());
            userRepo.deleteById(userId);
        }
    }

    private String validateUserRequest(UserRequest userRequest, boolean isUpdate) {
        StringBuilder builder = new StringBuilder();

        if (isUpdate) {
            if (userRequest.getId() == null || userRequest.getId().isEmpty()) {
                builder.append("User ID is missing");
            } else if (findByUserId(userRequest.getId()) == null) {
                builder.append("Provided User ID not found");
            }
        }
        if (userRequest.getFirstName() == null || userRequest.getFirstName().isEmpty()) {
            builder.append("First name is invalid/missing\n");
        }
        if (userRequest.getLastName() == null || userRequest.getLastName().isEmpty()) {
            builder.append("Last name is invalid/missing\n");
        }
        if (userRequest.getRoleNames() == null || userRequest.getRoleNames().isEmpty()) {
            builder.append("User roles are missing\n");
        }

        if (this.emailValidator == null) {
            builder.append("Email validation service is missing");
            logger.error("Email validation service cannot be instantiated");
        } else if (userRequest.getEmailAddress() == null
                || !this.emailValidator.isValid(userRequest.getEmailAddress())) {
            builder.append("Email Address is invalid/missing\n");
        }

        LoginDetail loginDetail = userRequest.getLoginDetail();
        if (loginDetail == null || (!isUpdate && loginDetail.getPassword() == null)) {
            builder.append("Login Credentials are invalid/missing\n");
        }

        return builder.toString();
    }

}
