package com.qbot.answeringservice.service;

import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

@Service
public class PwService {

    public String generateSalt() {
        return BCrypt.gensalt(7);
    }

    public String generatePasswordFromHash(String password, String salt) {
        return BCrypt.hashpw(password, salt);
    }

    public boolean validatePassword(String passwordGiven, String hashedPass) {
        return BCrypt.checkpw(passwordGiven, hashedPass);
    }
}
