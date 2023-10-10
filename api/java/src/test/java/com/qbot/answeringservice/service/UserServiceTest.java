package com.qbot.answeringservice.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.mongodb.assertions.Assertions;
import com.qbot.answeringservice.model.User;
import com.qbot.answeringservice.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    @Mock
    UserRepository userRepo;

    @InjectMocks
    UserService userService = new UserService();

    @Test
    public void testCreateUser() {
        Mockito.when(userRepo.save(ArgumentMatchers.any(User.class))).thenReturn(getAdminUsers().get(0));

        User createdUser = userService
                .createUser(new User(UUID.randomUUID(), null, UUID.randomUUID(), "firstName", "lastName", null));
        Assertions.assertNotNull(createdUser);
        Mockito.verify(userRepo, Mockito.times(1)).save(ArgumentMatchers.any(User.class));
    }

    @Test
    public void testFindAll() {
        Mockito.when(userRepo.findAll()).thenReturn(getAdminUsers());
        List<User> foundUsers = userService.findAllUsers();

        Assertions.assertFalse(foundUsers.isEmpty());
    }

    @Test
    public void testFindUserByUserId() {
        Mockito.when(userRepo.findById(ArgumentMatchers.any(UUID.class)))
                .thenReturn(Optional.of(getAdminUsers().get(0)));

        User foundUser = userService.findByUserId(UUID.randomUUID());
        Assertions.assertNotNull(foundUser);
    }

    @Test
    public void testFindUserByUserIdNoResult() {
        Mockito.when(userRepo.findById(ArgumentMatchers.any(UUID.class))).thenReturn(Optional.empty());

        User foundUser = userService.findByUserId(UUID.randomUUID());
        Assertions.assertNull(foundUser);
    }

    @Test
    public void testFindUserByLoginId() {
        Mockito.when(userRepo.findUserByLoginId(ArgumentMatchers.any(UUID.class))).thenReturn(getAdminUsers().get(0));

        User foundUser = userService.findByLoginId(UUID.randomUUID());
        Assertions.assertNotNull(foundUser);
    }

    @Test
    public void testFindUsersByRole() {
        Mockito.when(userRepo.findUsersByRole(ArgumentMatchers.anyString())).thenReturn(getAdminUsers());
        String roleIdValue = "6514b83d67e0b4d82e053ecb";
        List<User> foundUsers = userService.findByRoleId(roleIdValue);

        Assertions.assertFalse(foundUsers.isEmpty());
    }

    @Test
    public void testFindUsersByRoleNoResults() {
        Mockito.when(userRepo.findUsersByRole(ArgumentMatchers.anyString())).thenReturn(Collections.emptyList());

        String roleIdValue = "6514b83d67e0b4d82e053ecb";
        List<User> foundUsers = userService.findByRoleId(roleIdValue);

        Assertions.assertTrue(foundUsers.isEmpty());
    }

    @Test
    public void testDeleteUser() {
        userService.deleteUser(UUID.randomUUID());
        Mockito.verify(userRepo, Mockito.times(1)).deleteById(ArgumentMatchers.any(UUID.class));
    }

    @Test
    public void testDeleteUserNullInput() {
        userService.deleteUser(null);
        Mockito.verify(userRepo, Mockito.times(0)).deleteById(ArgumentMatchers.any(UUID.class));
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
