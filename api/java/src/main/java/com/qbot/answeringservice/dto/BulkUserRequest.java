package com.qbot.answeringservice.dto;

import java.util.List;

import lombok.Getter;

@Getter
public class BulkUserRequest {
    private final int numUsers;
    private final List<UserRequest> users;

    public BulkUserRequest(int numUsers, List<UserRequest> users) {
        this.numUsers = numUsers;
        this.users = users;
    }
}
