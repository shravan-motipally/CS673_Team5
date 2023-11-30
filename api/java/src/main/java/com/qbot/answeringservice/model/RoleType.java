package com.qbot.answeringservice.model;

public enum RoleType {
    ADMINISTRATOR("Administrator"), EDUCATOR("Educator");

    private String type;

    RoleType(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }

}
