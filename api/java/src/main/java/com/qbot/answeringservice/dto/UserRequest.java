package com.qbot.answeringservice.dto;

import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserRequest {
    private UUID id;
    private String photoUrl;
    private LoginDetail loginDetail;
    private String emailAddress;
    private String firstName;
    private String lastName;
    private List<Integer> roleIds;
    private List<String> courseIds;
}
