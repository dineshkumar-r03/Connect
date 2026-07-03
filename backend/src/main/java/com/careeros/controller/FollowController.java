package com.careeros.controller;

import com.careeros.dto.response.ApiResponse;
import com.careeros.entity.User;
import com.careeros.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class FollowController {
    
    private final FollowService followService;
    
    @PostMapping("/{id}/follow")
    public ResponseEntity<ApiResponse> followUser(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        followService.followUser(id, user);
        return ResponseEntity.ok(new ApiResponse(true, "Successfully followed user"));
    }
    
    @DeleteMapping("/{id}/follow")
    public ResponseEntity<ApiResponse> unfollowUser(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        followService.unfollowUser(id, user);
        return ResponseEntity.ok(new ApiResponse(true, "Successfully unfollowed user"));
    }

    @GetMapping("/{id}/follow/status")
    public ResponseEntity<Map<String, Boolean>> checkFollowStatus(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        boolean following = followService.isFollowing(id, user);
        return ResponseEntity.ok(Map.of("following", following));
    }
}