package com.careeros.validator;

import com.careeros.entity.User;
import com.careeros.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class UserValidator {
    
    private final UserRepository userRepository;
    
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[A-Za-z0-9+_.-]+@(.+)$"
    );
    
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
        "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$"
    );
    
    public boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }
    
    public boolean isValidPassword(String password) {
        return password != null && PASSWORD_PATTERN.matcher(password).matches();
    }
    
    public boolean isEmailUnique(String email) {
        return !userRepository.existsByEmail(email);
    }
    
    public boolean isValidUser(User user) {
        return user != null && isValidEmail(user.getEmail());
    }
    
    public void validateEmailUniqueness(String email, Long excludeUserId) {
        if (userRepository.findByEmail(email).isPresent()) {
            User existingUser = userRepository.findByEmail(email).get();
            if (excludeUserId == null || !existingUser.getId().equals(excludeUserId)) {
                throw new RuntimeException("Email already registered");
            }
        }
    }
}