package com.qbot.answeringservice.service;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static java.lang.String.format;
import static org.junit.jupiter.api.Assertions.*;
public class PwServiceTest {

    private PwService pwService;

    @BeforeEach
    public void setUp() {
        pwService = new PwService();
    }

    @Test
    void generatePasswordFromHash() {
        String salt = pwService.generateSalt();
        String hashed = pwService.generatePasswordFromHash("", salt);
        System.out.println(format("pw is: %s", hashed));
    }
}