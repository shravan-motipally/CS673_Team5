package com.qbot.answeringservice.model;

import lombok.Getter;

@Getter
public enum Role {
    ACCOUNT_ADMINISTRATOR(1, "Account Administrator", "Manages classes and assigns educators to classes"),
    EDUCATOR(2, "Educator", "Educates");

    private int id;
    private String name;
    private String description;

    Role(int id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public static String getRoleNameById(Integer id) {
        switch (id) {
        case 1:
            return ACCOUNT_ADMINISTRATOR.name;
        case 2:
            return EDUCATOR.name;
        default:
            return "Unknown";
        }
    }

}
