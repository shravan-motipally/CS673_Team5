package com.qbot.answeringservice.service;

import java.util.Random;

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

    /**
     * Generates cleartext password values for hashing. Not a substitute for
     * generatePasswordFromHash()
     * 
     * @return String of random alphanumeric characters (default length 10)
     */
    public String generateUnsaltedPassword() {
        int leftLimit = 48; // numeral '0'
        int rightLimit = 122; // letter 'z'
        int targetStringLength = 10;
        Random random = new Random();

        return random.ints(leftLimit, rightLimit + 1).filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
                .limit(targetStringLength)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append).toString();
    }
}
