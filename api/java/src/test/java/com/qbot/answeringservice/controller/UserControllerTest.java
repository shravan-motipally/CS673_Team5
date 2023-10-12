package com.qbot.answeringservice.controller;

import java.util.ArrayList;
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
        Mockito.when(userService.createUser(ArgumentMatchers.any(User.class))).thenReturn(getAdminUsers().get(0));

        ResponseEntity<User> response = userController
                .createUser(new User(UUID.randomUUID(), null, UUID.randomUUID(), "firstName", "lastName", null, null));
        Assertions.assertNotNull(response.getBody());
        Mockito.verify(userService, Mockito.times(1)).createUser(ArgumentMatchers.any(User.class));
    }

    @Test
    public void testCreateUserThrowException() {
        Mockito.when(userService.createUser(ArgumentMatchers.any(User.class)))
                .thenThrow(new IllegalArgumentException());

        ResponseEntity<User> response = userController
                .createUser(new User(UUID.randomUUID(), null, UUID.randomUUID(), "firstName", "lastName", null, null));
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
        Mockito.when(userService.findByLoginId(ArgumentMatchers.any(UUID.class))).thenReturn(getAdminUsers().get(0));

        ResponseEntity<User> response = userController.getUserByLoginId(UUID.randomUUID());
        Assertions.assertTrue(response.getStatusCode().is2xxSuccessful());
        User returnedUsers = response.getBody();
        Assertions.assertNotNull(returnedUsers);
    }

    @Test
    public void testGetUserByLoginIdThrowException() {
        Mockito.when(userService.findByLoginId(ArgumentMatchers.any(UUID.class)))
                .thenThrow(new IllegalArgumentException());

        ResponseEntity<User> response = userController.getUserByLoginId(UUID.randomUUID());
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

        ResponseEntity<User> response = userController
                .updateUser(new User(UUID.randomUUID(), null, UUID.randomUUID(), "firstName", "lastName", null, null));
        Assertions.assertNotNull(response.getBody());
        Mockito.verify(userService, Mockito.times(1)).updateUser(ArgumentMatchers.any(User.class));
    }

    @Test
    public void testUpdateUserThrowException() {
        Mockito.when(userService.updateUser(ArgumentMatchers.any(User.class)))
                .thenThrow(new IllegalArgumentException());

        ResponseEntity<User> response = userController
                .updateUser(new User(UUID.randomUUID(), null, UUID.randomUUID(), "firstName", "lastName", null, null));
        Assertions.assertFalse(response.getStatusCode().is2xxSuccessful());
        Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    @Test
    public void testDeleteUser() {
        ResponseEntity<User> response = userController.deleteUser(UUID.randomUUID());
        Assertions.assertTrue(response.getStatusCode().is2xxSuccessful());
        Assertions.assertTrue(HttpStatus.OK.value() == response.getStatusCodeValue());
        Mockito.verify(userService, Mockito.times(1)).deleteUser(ArgumentMatchers.any(UUID.class));
    }

    private List<User> getAdminUsers() {
        List<String> adminRoleIds = new ArrayList<>();
        adminRoleIds.add("6514b83d67e0b4d82e053ecb");

        List<User> adminUsers = new ArrayList<>();
        User testAdmin = new User(UUID.randomUUID(), null, UUID.randomUUID(), "Test", "User", adminRoleIds, null);
        adminUsers.add(testAdmin);

        return adminUsers;
    }
}
