package com.qbot.answeringservice.service;

import static java.lang.String.format;

import java.util.Base64;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.qbot.answeringservice.dto.LoginDetail;
import com.qbot.answeringservice.dto.LoginResponse;
import com.qbot.answeringservice.exception.UnathorizedUserException;
import com.qbot.answeringservice.model.Login;
import com.qbot.answeringservice.model.User;
import com.qbot.answeringservice.repository.LoginRepository;
import com.qbot.answeringservice.repository.UserRepository;

import lombok.NonNull;

@Service
public class LoginService {

    private static final Logger logger = LoggerFactory.getLogger(LoginService.class);
    private final LoginRepository loginRepository;
    private final UserRepository userRepository;
    private final PwService pwService;

    public LoginService(LoginRepository loginRepository, UserRepository userRepository, PwService pwService) {
        this.loginRepository = loginRepository;
        this.userRepository = userRepository;
        this.pwService = pwService;
    }

    public Login createLogin(@NonNull final String userName, @NonNull final String password) {
        return loginRepository.save(new Login(UUID.randomUUID().toString(), userName,
                pwService.generatePasswordFromHash(password, pwService.generateSalt())));
    }

    public Login createLogin(@NonNull final String userName) {
        return createLogin(userName, pwService.generateUnsaltedPassword());
    }

    public boolean checkLogin(LoginDetail detail) {
        if (detail != null) {
            Login login = loginRepository.findLoginByUserName(detail.getUsername());
            return pwService.validatePassword(new String(Base64.getDecoder().decode(detail.getPassword())),
                    login.getSaltedHash());
        }
        return false;
    }

    public LoginResponse retrieveUserInfo(LoginDetail detail) throws UnathorizedUserException {
        if (!checkLogin(detail)) {
            throw new UnathorizedUserException("Retrieving user information without being authorized");
        }
        try {
            Login login = loginRepository.findLoginByUserName(detail.getUsername());
            User user = userRepository.findUserByLoginId(login.getId());
            return LoginResponse.fromUser(user);
        } catch (Exception e) {
            logger.info(format("User not found with details userName: %s", detail.getUsername()));
            return null;
        }
    }
}
