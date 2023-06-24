package com.qbot.answeringservice.controller;

import com.qbot.answeringservice.dto.LoginDetail;
import com.qbot.answeringservice.dto.LoginResponse;
import com.qbot.answeringservice.exception.UnathorizedUserException;
import com.qbot.answeringservice.service.LoginService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import static java.lang.String.format;
import static org.apache.logging.log4j.util.Strings.isEmpty;

@Controller
public class LoginController {

    private final Logger logger = LoggerFactory.getLogger(LoginController.class);
    private final LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginDetail detail) {
        if (detail != null && !isEmpty(detail.getUsername()) && !isEmpty(detail.getPassword())) {
            logger.info(format("User %s attempting login", detail.getUsername()));
            try {
                if (loginService.checkLogin(detail)) {
                    return ResponseEntity.ok(loginService.retrieveUserInfo(detail));
                }
            } catch (UnathorizedUserException e) {
                logger.error("Unauthorized login attempt.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            } catch (Exception e) {
                logger.error("Server error: message: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
