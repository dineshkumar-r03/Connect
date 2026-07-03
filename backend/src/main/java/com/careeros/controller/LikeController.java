package com.careeros.controller;

import com.careeros.dto.response.ApiResponse;
import com.careeros.entity.User;
import com.careeros.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/blogs")
@RequiredArgsConstructor
public class LikeController {
    
    private final LikeService likeService;
    
    @PostMapping("/{id}/like")
    public ResponseEntity<ApiResponse> likeBlog(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        likeService.likeBlog(id, user);
        return ResponseEntity.ok(new ApiResponse(true, "Blog liked successfully"));
    }
    
    @DeleteMapping("/{id}/like")
    public ResponseEntity<ApiResponse> unlikeBlog(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        likeService.unlikeBlog(id, user);
        return ResponseEntity.ok(new ApiResponse(true, "Blog unliked successfully"));
    }
}