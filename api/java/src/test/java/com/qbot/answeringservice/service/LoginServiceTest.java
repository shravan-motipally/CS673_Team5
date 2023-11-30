package com.qbot.answeringservice.service;

import java.util.Base64;
import java.util.Optional;
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
        String testEncodedPassword = Base64.getEncoder().encodeToString(testPassword.getBytes());
        Mockito.when(loginRepo.save(ArgumentMatchers.any(Login.class))).thenReturn(generateTestLogin());
        Mockito.when(pwService.generateSalt()).thenReturn(testSalt);

        Login response = loginService.createLogin(testUsername, testEncodedPassword);
        Assertions.assertNotNull(response);

        Mockito.verify(pwService, Mockito.times(1)).generateSalt();
        Mockito.verify(pwService, Mockito.times(1)).generateHashFromPassword(ArgumentMatchers.anyString(),
                ArgumentMatchers.eq(testSalt));
        Mockito.verify(loginRepo, Mockito.times(1)).save(ArgumentMatchers.any(Login.class));
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
        Assertions.assertThrows(NullPointerException.class, () -> {
            loginService.checkLogin(null);
        });
    }

    @Test
    public void testCheckLoginBlank() {
        Assertions.assertFalse(loginService.checkLogin(new LoginDetail("", "")));
    }

    @Test
    public void updateLoginById() {
        Login testLogin = generateTestLogin();
        String testPassword = "testPassword";
        String testEncodedPassword = Base64.getEncoder().encodeToString(testPassword.getBytes());
        String testHashedPassword = "testHashedPassword";
        String testSalt = "testSaltValue";

        Mockito.when(loginRepo.findById(ArgumentMatchers.eq(testLogin.getId()))).thenReturn(Optional.of(testLogin));
        Mockito.when(pwService.generateSalt()).thenReturn(testSalt);
        Mockito.when(
                pwService.generateHashFromPassword(ArgumentMatchers.eq(testPassword), ArgumentMatchers.eq(testSalt)))
                .thenReturn(testHashedPassword);
        Mockito.when(loginRepo.save(ArgumentMatchers.any(Login.class))).thenReturn(generateTestLogin());

        Login updatedLogin = loginService.updateLoginById(testLogin.getId(), "testUsername", testEncodedPassword);
        Assertions.assertNotNull(updatedLogin);
        Mockito.verify(loginRepo, Mockito.times(1)).save(ArgumentMatchers.any(Login.class));
    }

    @Test
    public void updateLoginByIdBlankUsername() {
        Login testLogin = generateTestLogin();
        Login spyLogin = Mockito.spy(testLogin);
        String testPassword = "testPassword";
        String testEncodedPassword = Base64.getEncoder().encodeToString(testPassword.getBytes());
        String testHashedPassword = "testHashedPassword";
        String testSalt = "testSaltValue";

        Mockito.when(loginRepo.findById(ArgumentMatchers.eq(testLogin.getId()))).thenReturn(Optional.of(spyLogin));
        Mockito.when(pwService.generateSalt()).thenReturn(testSalt);
        Mockito.when(
                pwService.generateHashFromPassword(ArgumentMatchers.eq(testPassword), ArgumentMatchers.eq(testSalt)))
                .thenReturn(testHashedPassword);
        Mockito.when(loginRepo.save(ArgumentMatchers.any(Login.class))).thenReturn(testLogin);

        Login updatedLogin = loginService.updateLoginById(testLogin.getId(), "", testEncodedPassword);
        Assertions.assertNotNull(updatedLogin);
        Mockito.verify(spyLogin, Mockito.times(1)).setSaltedHash(ArgumentMatchers.eq(testHashedPassword));
        Mockito.verify(spyLogin, Mockito.times(0)).setUserName(ArgumentMatchers.anyString());
        Mockito.verify(loginRepo, Mockito.times(1)).save(ArgumentMatchers.any(Login.class));
    }

    @Test
    public void updateLoginByIdIdenticalUsernameBlankPassword() {
        Login testLogin = generateTestLogin();
        Login spyLogin = Mockito.spy(testLogin);
        String username = "testUsername";

        Mockito.when(loginRepo.findById(ArgumentMatchers.eq(testLogin.getId()))).thenReturn(Optional.of(spyLogin));

        Login updatedLogin = loginService.updateLoginById(testLogin.getId(), username, "");
        Assertions.assertNotNull(updatedLogin);
        Mockito.verify(spyLogin, Mockito.times(0)).setSaltedHash(ArgumentMatchers.anyString());
        Mockito.verify(spyLogin, Mockito.times(0)).setUserName(ArgumentMatchers.eq(username));
        Mockito.verify(loginRepo, Mockito.times(0)).save(ArgumentMatchers.any(Login.class));
    }

    @Test
    public void updateLoginByIdBlankPassword() {
        Login testLogin = generateTestLogin();
        Login spyLogin = Mockito.spy(testLogin);
        String username = "testUsername_updated";

        Mockito.when(loginRepo.findById(ArgumentMatchers.eq(testLogin.getId()))).thenReturn(Optional.of(spyLogin));
        Mockito.when(loginRepo.save(ArgumentMatchers.any(Login.class))).thenReturn(testLogin);

        Login updatedLogin = loginService.updateLoginById(testLogin.getId(), username, "");
        Assertions.assertNotNull(updatedLogin);
        Mockito.verify(spyLogin, Mockito.times(0)).setSaltedHash(ArgumentMatchers.anyString());
        Mockito.verify(spyLogin, Mockito.times(1)).setUserName(ArgumentMatchers.eq(username));
        Mockito.verify(loginRepo, Mockito.times(1)).save(ArgumentMatchers.any(Login.class));
    }

    @Test
    public void updateLoginByIdNotFound() {
        Login testLogin = generateTestLogin();
        Mockito.when(loginRepo.findById(ArgumentMatchers.eq(testLogin.getId()))).thenReturn(Optional.empty());
        Login updatedLogin = loginService.updateLoginById(testLogin.getId(), "testUsername", "testPassword");
        Assertions.assertNull(updatedLogin);
        Mockito.verify(loginRepo, Mockito.times(0)).save(ArgumentMatchers.any(Login.class));
    }

    @Test
    public void testRetrieveUserInfo() throws UnathorizedUserException {
        String testPassword = "testPassword";
        Login testLogin = this.generateTestLogin();
        Mockito.when(loginRepo.findLoginByUserName(ArgumentMatchers.anyString())).thenReturn(testLogin);
        Mockito.when(pwService.validatePassword(ArgumentMatchers.anyString(), ArgumentMatchers.anyString()))
                .thenReturn(true);

        User testUser = generateTestUser();
        Mockito.when(userRepo.findUserByLoginId(ArgumentMatchers.anyString())).thenReturn(testUser);

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
        Mockito.when(userRepo.findUserByLoginId(ArgumentMatchers.anyString())).thenReturn(null);

        LoginResponse response = loginService.retrieveUserInfo(new LoginDetail(testLogin.getUserName(), testPassword));
        Assertions.assertNull(response);
    }

    @Test
    public void testDeleteById() {
        String loginId = UUID.randomUUID().toString();
        loginService.deleteById(loginId);
        Mockito.verify(loginRepo, Mockito.times(1)).deleteById(ArgumentMatchers.eq(loginId));
    }

    @Test
    public void testDeleteByIdNull() {
        loginService.deleteById(null);
        Mockito.verify(loginRepo, Mockito.times(0)).deleteById(ArgumentMatchers.anyString());
    }

    @Test
    public void testValidateLoginDetail() {
        LoginDetail loginDetail = new LoginDetail("testUsername", "testPassword");
        Assertions.assertTrue(loginService.validateLoginDetailForUpdate(loginDetail));
    }

    @Test
    public void testValidateLoginDetailEmptyUsernameAndPassword() {
        LoginDetail loginDetail = new LoginDetail("", "");
        Assertions.assertFalse(loginService.validateLoginDetailForUpdate(loginDetail));
    }

    @Test
    public void testValidateLoginDetailNull() {
        Assertions.assertFalse(loginService.validateLoginDetailForUpdate(null));
    }

    @Test
    public void testValidateLoginDetailForUpdateEmptyUsernameAndPassword() {
        LoginDetail loginDetail = new LoginDetail("", "");
        Assertions.assertFalse(loginService.validateLoginDetailForUpdate(loginDetail));
    }

    private Login generateTestLogin() {
        return new Login(UUID.randomUUID().toString(), "testUsername", "testPasswordHash");
    }

    private User generateTestUser() {
        return new User(UUID.randomUUID().toString(), "photo/url/null.png", UUID.randomUUID().toString(),
                "test@email.biz", "firstName", "lastName", null, null);
    }

}
