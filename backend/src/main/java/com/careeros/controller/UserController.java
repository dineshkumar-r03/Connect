package com.careeros.controller;

import com.careeros.dto.request.ProfileUpdateRequest;
import com.careeros.dto.response.UserResponse;
import com.careeros.entity.User;
import com.careeros.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id, Authentication authentication) {
        Long currentUserId = null;
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            currentUserId = ((User) authentication.getPrincipal()).getId();
        }
        return ResponseEntity.ok(userService.getUserWithStats(id, currentUserId));
    }
    
    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(@Valid @RequestBody ProfileUpdateRequest request, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        return ResponseEntity.ok(userService.updateProfile(currentUser.getId(), request, currentUser));
    }
}
