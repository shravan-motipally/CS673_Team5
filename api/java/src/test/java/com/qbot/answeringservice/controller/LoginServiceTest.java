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
    public void testCreateLogin() {
        String testUsername = "testUsername";
        String testPassword = "testPassword";
        String testSalt = "testSaltValue";
        Mockito.when(loginRepo.save(ArgumentMatchers.any(Login.class))).thenReturn(generateTestLogin());
        Mockito.when(pwService.generateSalt()).thenReturn(testSalt);

        Login response = loginService.createLogin(testUsername, testPassword);
        Assertions.assertNotNull(response);

        Mockito.verify(pwService, Mockito.times(1)).generateSalt();
        Mockito.verify(pwService, Mockito.times(1)).generatePasswordFromHash(ArgumentMatchers.eq(testPassword),
                ArgumentMatchers.eq(testSalt));
        Mockito.verify(loginRepo, Mockito.times(1)).save(ArgumentMatchers.any(Login.class));
    }

    @Test
    public void testCreateLoginWithoutProvidedPassword() {
        String testUsername = "testUsername";
        String testPassword = "testPassword";
        String testSalt = "testSaltValue";
        Mockito.when(loginRepo.save(ArgumentMatchers.any(Login.class))).thenReturn(generateTestLogin());
        Mockito.when(pwService.generateUnsaltedPassword()).thenReturn(testPassword);
        Mockito.when(pwService.generateSalt()).thenReturn(testSalt);

        Login response = loginService.createLogin(testUsername);
        Assertions.assertNotNull(response);

        Mockito.verify(pwService, Mockito.times(1)).generateUnsaltedPassword();
        Mockito.verify(pwService, Mockito.times(1)).generateSalt();
        Mockito.verify(pwService, Mockito.times(1)).generatePasswordFromHash(ArgumentMatchers.eq(testPassword),
                ArgumentMatchers.eq(testSalt));
    }

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
        return new Login(UUID.randomUUID(), "testUsername", "testPasswordHash");
    }

    private User generateTestUser() {
        return new User(UUID.randomUUID(), "photo/url/null.png", UUID.randomUUID(), "firstName", "lastName", null,
                null);
    }

}
