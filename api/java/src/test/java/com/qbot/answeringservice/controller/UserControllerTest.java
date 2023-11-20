package com.qbot.answeringservice.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.qbot.answeringservice.dto.LoginDetail;
import com.qbot.answeringservice.dto.UserRequest;
import com.qbot.answeringservice.dto.UserResponse;
import com.qbot.answeringservice.model.Login;
import com.qbot.answeringservice.model.User;
import com.qbot.answeringservice.service.UserService;

@ExtendWith(MockitoExtension.class)
public class UserControllerTest {
    @Mock
    UserService userService;
    @InjectMocks
    UserController userController;

    @Test
    public void testCreateUser() {
        Mockito.when(userService.createUser(ArgumentMatchers.any(UserRequest.class))).thenReturn(getUserResponse());

        ResponseEntity<UserResponse> response = userController.createUser(getUserRequest());
        Assertions.assertNotNull(response.getBody());
        Mockito.verify(userService, Mockito.times(1)).createUser(ArgumentMatchers.any(UserRequest.class));
    }

    @Test
    public void testCreateUserThrowException() {
        Mockito.when(userService.createUser(ArgumentMatchers.any(UserRequest.class)))
                .thenThrow(new IllegalArgumentException());

        ResponseEntity<UserResponse> response = userController.createUser(getUserRequest());
        Assertions.assertFalse(response.getStatusCode().is2xxSuccessful());
        Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    @Test
    public void testGetAllUsers() {
        Mockito.when(userService.findAllUsers()).thenReturn(getAdminUsers());

        ResponseEntity<List<User>> response = userController.getAllUsers();
        Assertions.assertTrue(response.getStatusCode().is2xxSuccessful());
        List<User> returnedUsers = response.getBody();
        Assertions.assertNotNull(returnedUsers);
        Assertions.assertFalse(returnedUsers.isEmpty());
    }

    @Test
    public void testGetAllUsersThrowException() {
        Mockito.when(userService.findAllUsers()).thenThrow(new IllegalArgumentException());

        ResponseEntity<List<User>> response = userController.getAllUsers();
        Assertions.assertFalse(response.getStatusCode().is2xxSuccessful());
        Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    @Test
    public void testGetUserByLoginId() {
        Mockito.when(userService.findByLoginId(ArgumentMatchers.anyString())).thenReturn(getAdminUsers().get(0));

        ResponseEntity<User> response = userController.getUserByLoginId(UUID.randomUUID().toString());
        Assertions.assertTrue(response.getStatusCode().is2xxSuccessful());
        User returnedUsers = response.getBody();
        Assertions.assertNotNull(returnedUsers);
    }

    @Test
    public void testGetUserByLoginIdThrowException() {
        Mockito.when(userService.findByLoginId(ArgumentMatchers.anyString())).thenThrow(new IllegalArgumentException());

        ResponseEntity<User> response = userController.getUserByLoginId(UUID.randomUUID().toString());
        Assertions.assertFalse(response.getStatusCode().is2xxSuccessful());
        Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    @Test
    public void testGetUserByRoleId() {
        Mockito.when(userService.findByRoleId(ArgumentMatchers.anyString())).thenReturn(getAdminUsers());

        ResponseEntity<List<User>> response = userController.getUsersByRoleId(new String());
        Assertions.assertTrue(response.getStatusCode().is2xxSuccessful());
        List<User> returnedUsers = response.getBody();
        Assertions.assertNotNull(returnedUsers);
        Assertions.assertFalse(returnedUsers.isEmpty());
    }

    @Test
    public void testGetUserByRoleIdThrowException() {
        Mockito.when(userService.findByRoleId(ArgumentMatchers.anyString())).thenThrow(new IllegalArgumentException());

        ResponseEntity<List<User>> response = userController.getUsersByRoleId(new String());
        Assertions.assertFalse(response.getStatusCode().is2xxSuccessful());
        Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    @Test
    public void testUpdateUser() {
        Mockito.when(userService.updateUser(ArgumentMatchers.any(User.class))).thenReturn(getAdminUsers().get(0));

        ResponseEntity<User> response = userController.updateUser(new User(UUID.randomUUID().toString(), null,
                UUID.randomUUID().toString(), "test@email.com", "firstName", "lastName", null, null));
        Assertions.assertNotNull(response.getBody());
        Mockito.verify(userService, Mockito.times(1)).updateUser(ArgumentMatchers.any(User.class));
    }

    @Test
    public void testUpdateUserThrowException() {
        Mockito.when(userService.updateUser(ArgumentMatchers.any(User.class)))
                .thenThrow(new IllegalArgumentException());

        ResponseEntity<User> response = userController.updateUser(new User(UUID.randomUUID().toString(), null,
                UUID.randomUUID().toString(), "test@email.com", "firstName", "lastName", null, null));
        Assertions.assertFalse(response.getStatusCode().is2xxSuccessful());
        Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    @Test
    public void testBulkUpdateUsers() {
        Mockito.when(userService.bulkUpdateUsers(ArgumentMatchers.anyList())).thenReturn(getAdminUsers());
        ResponseEntity<List<User>> response = userController.bulkUpdateUsers(getAdminUsers());
        Assertions.assertTrue(response.getStatusCode().is2xxSuccessful());
        Mockito.verify(userService, Mockito.times(1)).bulkUpdateUsers(ArgumentMatchers.anyList());
    }

    @Test
    public void testBulkUpdateUsersZeroUpdates() {
        Mockito.when(userService.bulkUpdateUsers(ArgumentMatchers.anyList())).thenReturn(Collections.emptyList());
        ResponseEntity<List<User>> response = userController.bulkUpdateUsers(getAdminUsers());
        Assertions.assertTrue(response.getStatusCode().is4xxClientError());
        Mockito.verify(userService, Mockito.times(1)).bulkUpdateUsers(ArgumentMatchers.anyList());
    }

    @Test
    public void testBulkUpdateUsersNullResponse() {
        Mockito.when(userService.bulkUpdateUsers(ArgumentMatchers.anyList())).thenReturn(null);
        ResponseEntity<List<User>> response = userController.bulkUpdateUsers(getAdminUsers());
        Assertions.assertTrue(response.getStatusCode().is5xxServerError());
        Mockito.verify(userService, Mockito.times(1)).bulkUpdateUsers(ArgumentMatchers.anyList());
    }

    @Test
    public void testBulkUpdateUsersThrowException() {
        Mockito.when(userService.bulkUpdateUsers(ArgumentMatchers.anyList())).thenThrow(new IllegalArgumentException());
        ResponseEntity<List<User>> response = userController.bulkUpdateUsers(getAdminUsers());
        Assertions.assertFalse(response.getStatusCode().is2xxSuccessful());
        Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        Mockito.verify(userService, Mockito.times(1)).bulkUpdateUsers(ArgumentMatchers.anyList());
    }

    @Test
    public void testDeleteUser() {
        ResponseEntity<Void> response = userController.deleteUser(UUID.randomUUID().toString());
        Assertions.assertTrue(response.getStatusCode().is2xxSuccessful());
        Assertions.assertTrue(HttpStatus.OK.value() == response.getStatusCodeValue());
        Mockito.verify(userService, Mockito.times(1)).deleteUser(ArgumentMatchers.anyString());
    }

    private List<User> getAdminUsers() {
        List<Integer> adminRoleIds = new ArrayList<>();
        adminRoleIds.add(1);

        List<User> adminUsers = new ArrayList<>();
        User testAdmin = new User(UUID.randomUUID().toString(), null, UUID.randomUUID().toString(), "test@email.com",
                "Test", "User", adminRoleIds, null);
        adminUsers.add(testAdmin);

        return adminUsers;
    }

    private UserRequest getUserRequest() {
        LoginDetail loginDetail = new LoginDetail("test@email.com", "testPassw0rd");
        return new UserRequest(UUID.randomUUID().toString(), null, loginDetail, "test@email.com", "Test", "User", null,
                null);
    }

    private UserResponse getUserResponse() {
        User testUser = getAdminUsers().get(0);
        Login testLogin = new Login(UUID.randomUUID().toString(), "testUser", "testHashedPW");
        return UserResponse.convertFromEntity(testUser, testLogin);
    }
}
