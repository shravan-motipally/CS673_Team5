package com.qbot.answeringservice.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserRequest {
    private String id;
    private String photoUrl;
    private LoginDetail loginDetail;
    private String emailAddress;
    private String firstName;
    private String lastName;
    private List<Integer> roleIds;
    private List<String> courseIds;
}
