package com.qbot.answeringservice.service;

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

    /**
     * 
     * @param userName             String username value
     * @param encodedPasswordValue Base64-encoded password value to be encrypted
     * @return
     */
    public Login createLogin(@NonNull final String userName, @NonNull final String encodedPasswordValue) {
        String decodedPasswordValue = new String(Base64.getDecoder().decode(encodedPasswordValue));
        return loginRepository.save(new Login(UUID.randomUUID().toString(), userName,
                pwService.generateHashFromPassword(decodedPasswordValue, pwService.generateSalt())));
    }

    public Login getLoginById(String loginId) {
        return loginRepository.findById(loginId).orElse(null);
    }

    public boolean checkLogin(LoginDetail detail) {
        if (validateLoginDetail(detail)) {
            Login login = loginRepository.findLoginByUserName(detail.getUsername());
            return pwService.validatePassword(new String(Base64.getDecoder().decode(detail.getPassword())),
                    login.getSaltedHash());
        }
        return false;
    }

    public Login updateLoginById(@NonNull final String loginId, @NonNull final String username,
            @NonNull final String encodedPasswordValue) {
        Login existingLogin = this.getLoginById(loginId);
        if (existingLogin != null && !username.isBlank() && !encodedPasswordValue.isBlank()) {
            existingLogin.setUserName(username);

            String decodedPasswordValue = new String(Base64.getDecoder().decode(encodedPasswordValue));
            String hashedPasswordValue = pwService.generateHashFromPassword(decodedPasswordValue,
                    pwService.generateSalt());
            existingLogin.setSaltedHash(hashedPasswordValue);
            return loginRepository.save(existingLogin);
        } else {
            logger.info("No login found with ID: {}", loginId);
            return null;
        }
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
            logger.info("User not found with username: {}", e.getMessage());
            return null;
        }
    }

    public boolean validateLoginDetail(final LoginDetail loginDetail) {
        return loginDetail != null && !(loginDetail.getUsername() == null || loginDetail.getUsername().isBlank())
                && !(loginDetail.getPassword() == null || loginDetail.getPassword().isBlank());
    }
}
