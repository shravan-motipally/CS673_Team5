package com.qbot.answeringservice.controller;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import com.qbot.answeringservice.dto.LoginDetail;
import com.qbot.answeringservice.dto.LoginResponse;
import com.qbot.answeringservice.service.LoginService;

import io.github.bucket4j.Bucket;

@ExtendWith(MockitoExtension.class)
public class LoginControllerTest {

    @Mock
    LoginService loginService;
    @Mock
    Bucket bucket;
    @InjectMocks
    LoginController loginController;

    @Test
    public void testLogin() {
        LoginDetail detail = new LoginDetail(null, null);
        ResponseEntity<LoginResponse> response = loginController.login(detail);
        Assertions.assertNotNull(response);
    }

}
