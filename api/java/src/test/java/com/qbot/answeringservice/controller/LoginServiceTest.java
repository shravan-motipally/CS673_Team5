package com.qbot.answeringservice.controller;

import java.util.UUID;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.qbot.answeringservice.dto.LoginDetail;
import com.qbot.answeringservice.dto.LoginResponse;
import com.qbot.answeringservice.exception.UnathorizedUserException;
import com.qbot.answeringservice.model.Login;
import com.qbot.answeringservice.model.User;
import com.qbot.answeringservice.repository.LoginRepository;
import com.qbot.answeringservice.repository.UserRepository;
import com.qbot.answeringservice.service.LoginService;
import com.qbot.answeringservice.service.PwService;

@ExtendWith(MockitoExtension.class)
public class LoginServiceTest {

    @Mock
    LoginRepository loginRepo;
    @Mock
    UserRepository userRepo;
    @Mock
    PwService pwService;
    @InjectMocks
    LoginService loginService;

    @Test
    public void testCheckLogin() {
        String testPassword = "testPassword";
        Login testLogin = this.generateTestLogin();
        Mockito.when(loginRepo.findLoginByUserName(ArgumentMatchers.anyString())).thenReturn(testLogin);
        Mockito.when(pwService.validatePassword(ArgumentMatchers.anyString(), ArgumentMatchers.anyString()))
                .thenReturn(true);

        Assertions.assertTrue(loginService.checkLogin(new LoginDetail(testLogin.getUserName(), testPassword)));
    }

    @Test
    public void testCheckLoginNull() {
        Assertions.assertFalse(loginService.checkLogin(null));
    }

    @Test
    public void testRetrieveUserInfo() throws UnathorizedUserException {
        String testPassword = "testPassword";
        Login testLogin = this.generateTestLogin();
        Mockito.when(loginRepo.findLoginByUserName(ArgumentMatchers.anyString())).thenReturn(testLogin);
        Mockito.when(pwService.validatePassword(ArgumentMatchers.anyString(), ArgumentMatchers.anyString()))
                .thenReturn(true);

        User testUser = generateTestUser();
        Mockito.when(userRepo.findUserByLoginId(ArgumentMatchers.any(UUID.class))).thenReturn(testUser);

        LoginResponse response = loginService.retrieveUserInfo(new LoginDetail(testLogin.getUserName(), testPassword));
        Assertions.assertNotNull(response);
        Assertions.assertEquals(testUser.getFirstName(), response.getFirstName());
        Assertions.assertEquals(testUser.getLastName(), response.getLastName());
        Assertions.assertEquals(testUser.getPhotoUrl(), response.getPhotoUrl());
    }

    @Test
    public void testRetrieveUserInfoUnauthorized() {
        String testPassword = "testPassword";
        Login testLogin = this.generateTestLogin();
        Mockito.when(loginRepo.findLoginByUserName(ArgumentMatchers.anyString())).thenReturn(testLogin);
        Mockito.when(pwService.validatePassword(ArgumentMatchers.anyString(), ArgumentMatchers.anyString()))
                .thenReturn(false);
        Assertions.assertThrows(UnathorizedUserException.class, () -> {
            loginService.retrieveUserInfo(new LoginDetail(testLogin.getUserName(), testPassword));
        });
    }

    @Test
    public void testRetrieveUserInfoNoUserFound() throws UnathorizedUserException {
        String testPassword = "testPassword";
        Login testLogin = this.generateTestLogin();
        Mockito.when(loginRepo.findLoginByUserName(ArgumentMatchers.anyString())).thenReturn(testLogin);
        Mockito.when(pwService.validatePassword(ArgumentMatchers.anyString(), ArgumentMatchers.anyString()))
                .thenReturn(true);
        Mockito.when(userRepo.findUserByLoginId(ArgumentMatchers.any(UUID.class))).thenReturn(null);

        LoginResponse response = loginService.retrieveUserInfo(new LoginDetail(testLogin.getUserName(), testPassword));
        Assertions.assertNull(response);
    }

    private Login generateTestLogin() {
        return new Login(UUID.randomUUID(), "testUsername", "testPassword");
    }

    private User generateTestUser() {
        return new User(UUID.randomUUID(), "photo/url/null.png", UUID.randomUUID(), "firstName", "lastName", null,
                null);
    }

}
