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
import com.qbot.answeringservice.dto.LoginDetail;
import com.qbot.answeringservice.dto.UserRequest;
import com.qbot.answeringservice.dto.UserResponse;
import com.qbot.answeringservice.model.Login;
import com.qbot.answeringservice.model.User;
import com.qbot.answeringservice.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    @Mock
    UserRepository userRepo;

    @Mock
    LoginService loginService;

    @InjectMocks
    UserService userService = new UserService();

    @Test
    public void testCreateUser() {
        User testUser = getAdminUsers().get(0);
        Mockito.when(loginService.createLogin(ArgumentMatchers.anyString(), ArgumentMatchers.anyString()))
                .thenReturn(getTestLogin());
        Mockito.when(userRepo.save(ArgumentMatchers.any(User.class))).thenReturn(testUser);

        UserRequest request = getUserRequest();
        request.setId(null);
        UserResponse createdUser = userService.createUser(request);
        Assertions.assertNotNull(createdUser);
        Mockito.verify(loginService, Mockito.times(1)).createLogin(ArgumentMatchers.anyString(),
                ArgumentMatchers.anyString());
        Mockito.verify(userRepo, Mockito.times(1)).save(ArgumentMatchers.any(User.class));
    }

    @Test
    public void testCreateUserWithDifferentUsername() {
        User testUser = getAdminUsers().get(0);
        Mockito.when(loginService.createLogin(ArgumentMatchers.anyString(), ArgumentMatchers.anyString()))
                .thenReturn(getTestLogin());
        Mockito.when(userRepo.save(ArgumentMatchers.any(User.class))).thenReturn(testUser);

        UserRequest request = getUserRequest();
        LoginDetail loginDetail = new LoginDetail("", "testPassw0rd");
        request.setLoginDetail(loginDetail);
        UserResponse createdUser = userService.createUser(request);
        Assertions.assertNotNull(createdUser);
        Mockito.verify(loginService, Mockito.times(1)).createLogin(ArgumentMatchers.eq(request.getEmailAddress()),
                ArgumentMatchers.eq(loginDetail.getPassword()));
        Mockito.verify(userRepo, Mockito.times(1)).save(ArgumentMatchers.any(User.class));
    }

    @Test
    public void testCreateUserValidationFailureNullEmailAddress() {
        UserRequest request = getUserRequest();
        request.setEmailAddress(null);
        UserResponse createdUser = userService.createUser(request);
        Assertions.assertNull(createdUser);
        Mockito.verify(userRepo, Mockito.never()).save(ArgumentMatchers.any(User.class));
        Mockito.verify(loginService, Mockito.never()).createLogin(ArgumentMatchers.anyString(),
                ArgumentMatchers.anyString());
    }

    @Test
    public void testCreateUserValidationFailureInvalidEmailAddress() {
        UserRequest request = getUserRequest();
        request.setEmailAddress("InvalidAddress.info");
        UserResponse createdUser = userService.createUser(request);
        Assertions.assertNull(createdUser);
        Mockito.verify(userRepo, Mockito.never()).save(ArgumentMatchers.any(User.class));
        Mockito.verify(loginService, Mockito.never()).createLogin(ArgumentMatchers.anyString(),
                ArgumentMatchers.anyString());
    }

    @Test
    public void testCreateUserValidationFailureNullLogin() {
        UserRequest request = getUserRequest();
        request.setLoginDetail(null);
        UserResponse createdUser = userService.createUser(request);
        Assertions.assertNull(createdUser);
        Mockito.verify(userRepo, Mockito.never()).save(ArgumentMatchers.any(User.class));
        Mockito.verify(loginService, Mockito.never()).createLogin(ArgumentMatchers.anyString(),
                ArgumentMatchers.anyString());
    }

    @Test
    public void testCreateUserValidationFailureNullPassword() {
        UserRequest request = getUserRequest();
        LoginDetail loginDetail = new LoginDetail(request.getEmailAddress(), null);
        request.setLoginDetail(loginDetail);
        UserResponse createdUser = userService.createUser(request);
        Assertions.assertNull(createdUser);
        Mockito.verify(userRepo, Mockito.never()).save(ArgumentMatchers.any(User.class));
        Mockito.verify(loginService, Mockito.never()).createLogin(ArgumentMatchers.anyString(),
                ArgumentMatchers.anyString());
    }

    @Test
    public void testCreateUserLoginServiceFailure() {
        Mockito.when(loginService.createLogin(ArgumentMatchers.anyString(), ArgumentMatchers.anyString()))
                .thenReturn(null);
        UserResponse createdUser = userService.createUser(getUserRequest());
        Assertions.assertNull(createdUser);
        Mockito.verify(userRepo, Mockito.never()).save(ArgumentMatchers.any(User.class));
    }

    @Test
    public void testFindAll() {
        Mockito.when(userRepo.findAll()).thenReturn(getAdminUsers());
        Mockito.when(loginService.getLoginById(ArgumentMatchers.anyString()))
                .thenReturn(new Login(null, "testUser", "testPW"));
        List<UserResponse> foundUsers = userService.findAllUsers();

        Assertions.assertFalse(foundUsers.isEmpty());
    }

    @Test
    public void testFindUserByUserId() {
        Mockito.when(userRepo.findById(ArgumentMatchers.anyString())).thenReturn(Optional.of(getAdminUsers().get(0)));

        User foundUser = userService.findByUserId(UUID.randomUUID().toString());
        Assertions.assertNotNull(foundUser);
    }

    @Test
    public void testFindUserByUserIdNoResult() {
        Mockito.when(userRepo.findById(ArgumentMatchers.anyString())).thenReturn(Optional.empty());

        User foundUser = userService.findByUserId(UUID.randomUUID().toString());
        Assertions.assertNull(foundUser);
    }

    @Test
    public void testFindUserByLoginId() {
        Mockito.when(userRepo.findUserByLoginId(ArgumentMatchers.anyString())).thenReturn(getAdminUsers().get(0));

        User foundUser = userService.findByLoginId(UUID.randomUUID().toString());
        Assertions.assertNotNull(foundUser);
    }

    @Test
    public void testFindUsersByRole() {
        Mockito.when(userRepo.findUsersByRole(ArgumentMatchers.anyInt())).thenReturn(getAdminUsers());
        Integer roleIdValue = 1;
        List<User> foundUsers = userService.findByRoleId(roleIdValue);

        Assertions.assertFalse(foundUsers.isEmpty());
    }

    @Test
    public void testFindUsersByRoleNoResults() {
        Mockito.when(userRepo.findUsersByRole(ArgumentMatchers.anyInt())).thenReturn(Collections.emptyList());

        Integer roleIdValue = 1;
        List<User> foundUsers = userService.findByRoleId(roleIdValue);

        Assertions.assertTrue(foundUsers.isEmpty());
    }

    @Test
    public void testUpdateUser() {
        UserRequest request = getUserRequest();
        LoginDetail loginDetail = request.getLoginDetail();
        User returnedUser = getAdminUsers().get(0);
        request.setId(returnedUser.getId());

        Mockito.when(userRepo.existsById(ArgumentMatchers.anyString())).thenReturn(true);
        Mockito.when(userRepo.findById(ArgumentMatchers.eq(returnedUser.getId())))
                .thenReturn(Optional.of(returnedUser));
        Mockito.when(loginService.getLoginById(ArgumentMatchers.anyString())).thenReturn(getTestLogin());
        Mockito.when(loginService.validateLoginDetailForUpdate(ArgumentMatchers.eq(request.getLoginDetail())))
                .thenReturn(true);
        Mockito.when(loginService.updateLoginById(ArgumentMatchers.eq(returnedUser.getLoginId()),
                ArgumentMatchers.eq(loginDetail.getUsername()), ArgumentMatchers.eq(loginDetail.getPassword())))
                .thenReturn(getTestLogin());
        Mockito.when(userRepo.save(ArgumentMatchers.any(User.class))).thenReturn(returnedUser);

        UserResponse updatedUser = userService.updateUser(request);
        Assertions.assertNotNull(updatedUser);
        Mockito.verify(loginService, Mockito.times(1)).updateLoginById(ArgumentMatchers.eq(returnedUser.getLoginId()),
                ArgumentMatchers.eq(loginDetail.getUsername()), ArgumentMatchers.eq(loginDetail.getPassword()));
        Mockito.verify(userRepo, Mockito.times(1)).save(ArgumentMatchers.any(User.class));
    }

    @Test
    public void testUpdateUserWithoutPassword() {
        UserRequest request = getUserRequest();
        request.setLoginDetail(new LoginDetail("testUser", null));
        User returnedUser = getAdminUsers().get(0);
        request.setId(returnedUser.getId());

        Mockito.when(userRepo.existsById(ArgumentMatchers.anyString())).thenReturn(true);
        Mockito.when(userRepo.findById(ArgumentMatchers.eq(returnedUser.getId())))
                .thenReturn(Optional.of(returnedUser));
        Mockito.when(loginService.getLoginById(ArgumentMatchers.anyString())).thenReturn(getTestLogin());
        Mockito.when(loginService.validateLoginDetailForUpdate(ArgumentMatchers.eq(request.getLoginDetail())))
                .thenReturn(false);
        Mockito.when(userRepo.save(ArgumentMatchers.any(User.class))).thenReturn(returnedUser);

        UserResponse updatedUser = userService.updateUser(request);
        Assertions.assertNotNull(updatedUser);
        Mockito.verify(loginService, Mockito.times(0)).updateLoginById(ArgumentMatchers.eq(returnedUser.getLoginId()),
                ArgumentMatchers.anyString(), ArgumentMatchers.anyString());
        Mockito.verify(userRepo, Mockito.times(1)).save(ArgumentMatchers.any(User.class));
    }

    @Test
    public void testUpdateUserInvalidUserId() {
        UserRequest request = getUserRequest();
        request.setId(null);
        UserResponse updatedUser = userService.updateUser(request);
        Assertions.assertNull(updatedUser);
        Mockito.verify(userRepo, Mockito.times(0)).save(ArgumentMatchers.any(User.class));
    }

    @Test
    public void testUpdateUserInvalidRoles() {
        UserRequest request = getUserRequest();
        request.setId(UUID.randomUUID().toString());
        request.setRoleNames(Collections.emptyList());
        UserResponse updatedUser = userService.updateUser(request);
        Assertions.assertNull(updatedUser);
        Mockito.verify(userRepo, Mockito.times(0)).save(ArgumentMatchers.any(User.class));
    }

    @Test
    public void testBulkUpdateUsers() {
        List<UserRequest> userRequestList = new ArrayList<>();
        userRequestList.add(getUserRequest());
        Mockito.when(userRepo.existsById(ArgumentMatchers.anyString())).thenReturn(true);
        Mockito.when(userRepo.findById(ArgumentMatchers.anyString())).thenReturn(Optional.of(getAdminUsers().get(0)));
        Mockito.when(loginService.getLoginById(ArgumentMatchers.anyString())).thenReturn(getTestLogin());
        Mockito.when(userRepo.save(ArgumentMatchers.any(User.class))).thenReturn(getAdminUsers().get(0));
        Assertions.assertFalse(userService.bulkProcessUsers(userRequestList).isEmpty());
        Mockito.verify(userRepo, Mockito.times(1)).save(ArgumentMatchers.any(User.class));
    }

    @Test
    public void testBulkUpdateUsersNoExisting() {
        List<UserRequest> userRequestList = new ArrayList<>();
        userRequestList.add(getUserRequest());
        Mockito.when(userRepo.existsById(ArgumentMatchers.anyString())).thenReturn(false);
        Assertions.assertTrue(userService.bulkProcessUsers(userRequestList).isEmpty());
        Mockito.verify(userRepo, Mockito.times(0)).saveAll(ArgumentMatchers.anyList());
    }

    @Test
    public void testBulkUpdateUsersError() {
        List<UserRequest> userRequestList = new ArrayList<>();
        userRequestList.add(getUserRequest());
        Mockito.when(userRepo.existsById(ArgumentMatchers.anyString())).thenReturn(true);
        Mockito.when(userRepo.findById(ArgumentMatchers.anyString())).thenReturn(Optional.of(getAdminUsers().get(0)));
        Mockito.when(loginService.getLoginById(ArgumentMatchers.anyString())).thenReturn(getTestLogin());
        Mockito.when(userRepo.save(ArgumentMatchers.any(User.class))).thenReturn(null);
        Assertions.assertTrue(userService.bulkProcessUsers(userRequestList).isEmpty());
        Mockito.verify(userRepo, Mockito.times(1)).save(ArgumentMatchers.any(User.class));
    }

    @Test
    public void testBulkUpdateUsersValidationAllFail() {
        List<UserRequest> userRequestList = new ArrayList<>();
        userRequestList.add(getUserRequest());
        for (UserRequest user : userRequestList) {
            user.setEmailAddress(null);
        }

        Mockito.when(userRepo.existsById(ArgumentMatchers.anyString())).thenReturn(true);
        Assertions.assertTrue(userService.bulkProcessUsers(userRequestList).isEmpty());
        Mockito.verify(userRepo, Mockito.times(0)).saveAll(ArgumentMatchers.anyList());
    }

    @Test
    public void testBulkUpdateUsersValidationMixed() {
        List<UserRequest> userRequestList = new ArrayList<>();
        userRequestList.add(getUserRequest());
        UserRequest invalidUserRequest = new UserRequest("idString", null, null, "test@email.com", "firstName",
                "lastName", null, null);
        userRequestList.add(invalidUserRequest);

        Mockito.when(userRepo.existsById(ArgumentMatchers.anyString())).thenReturn(true);
        Mockito.when(userRepo.findById(ArgumentMatchers.anyString())).thenReturn(Optional.of(getAdminUsers().get(0)));
        Mockito.when(loginService.getLoginById(ArgumentMatchers.anyString())).thenReturn(getTestLogin());
        Mockito.when(userRepo.save(ArgumentMatchers.any(User.class))).thenReturn(getAdminUsers().get(0));

        Assertions.assertFalse(userService.bulkProcessUsers(userRequestList).isEmpty());
        Mockito.verify(userRepo, Mockito.times(1)).save(ArgumentMatchers.any(User.class));
    }

    @Test
    public void testDeleteUser() {
        User testUser = getAdminUsers().get(0);
        Mockito.when(userRepo.findById(ArgumentMatchers.eq(testUser.getId()))).thenReturn(Optional.of(testUser));
        userService.deleteUser(testUser.getId());
        Mockito.verify(userRepo, Mockito.times(1)).deleteById(ArgumentMatchers.eq(testUser.getId()));
        Mockito.verify(loginService, Mockito.times(1)).deleteById(ArgumentMatchers.eq(testUser.getLoginId()));
    }

    @Test
    public void testDeleteUserNullInput() {
        userService.deleteUser(null);
        Mockito.verify(userRepo, Mockito.times(0)).deleteById(ArgumentMatchers.anyString());
        Mockito.verify(loginService, Mockito.times(0)).deleteById(ArgumentMatchers.anyString());
    }

    private UserRequest getUserRequest() {
        List<String> roleNames = new ArrayList<>();
        roleNames.add("Educator");
        LoginDetail loginDetail = new LoginDetail("test@email.com", "testPassw0rd");
        return new UserRequest(UUID.randomUUID().toString(), null, loginDetail, "test@email.com", "Test", "User",
                roleNames, null);
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

    private Login getTestLogin() {
        return new Login(UUID.randomUUID().toString(), "test@email.com", "testPasswordHash");
    }
}
