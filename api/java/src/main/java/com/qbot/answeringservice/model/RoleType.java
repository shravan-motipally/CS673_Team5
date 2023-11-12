package com.qbot.answeringservice.model;

public enum RoleType {
    ACCOUNT_ADMINISTRATOR("Account Administrator"),
    EDUCATOR("Educator");

    private String type;
    RoleType(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }

}
