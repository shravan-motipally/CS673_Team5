package com.qbot.answeringservice.service;

import static java.lang.String.format;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

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
        Assertions.assertNotNull(hashed);
        System.out.println(format("pw is: %s", hashed));
    }
}