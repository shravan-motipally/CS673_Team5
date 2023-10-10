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
    public void testGetAllUsers() {
        Mockito.when(userService.findAllUsers()).thenReturn(getAdminUsers());

        ResponseEntity<List<User>> response = userController.getAllUsers();
        Assertions.assertTrue(response.getStatusCode().is2xxSuccessful());
        List<User> returnedUsers = response.getBody();
        Assertions.assertNotNull(returnedUsers);
        Assertions.assertFalse(returnedUsers.isEmpty());
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
    public void testGetUserByRoleId() {
        Mockito.when(userService.findByRoleId(ArgumentMatchers.anyString())).thenReturn(getAdminUsers());

        ResponseEntity<List<User>> response = userController.getUsersByRoleId(new String());
        Assertions.assertTrue(response.getStatusCode().is2xxSuccessful());
        List<User> returnedUsers = response.getBody();
        Assertions.assertNotNull(returnedUsers);
        Assertions.assertFalse(returnedUsers.isEmpty());
    }

    @Test
    public void testDeleteUserThrowException() {
        ResponseEntity<User> response = userController.deleteUser(UUID.randomUUID());
        Assertions.assertTrue(response.getStatusCode().is2xxSuccessful());
        Assertions.assertTrue(HttpStatus.OK.value() == response.getStatusCodeValue());
        Mockito.verify(userService, Mockito.times(1)).deleteUser(ArgumentMatchers.any(UUID.class));
    }

    private List<User> getAdminUsers() {
        List<String> adminRoleIds = new ArrayList<>();
        adminRoleIds.add("6514b83d67e0b4d82e053ecb");

        List<User> adminUsers = new ArrayList<>();
        User testAdmin = new User(UUID.randomUUID(), null, UUID.randomUUID(), "Test", "User", adminRoleIds);
        adminUsers.add(testAdmin);

        return adminUsers;
    }
}
