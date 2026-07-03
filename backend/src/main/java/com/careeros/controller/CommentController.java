package com.careeros.controller;

import com.careeros.dto.request.CommentRequest;
import com.careeros.dto.response.CommentResponse;
import com.careeros.entity.User;
import com.careeros.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/blogs/{blogId}/comments")
    public ResponseEntity<Page<CommentResponse>> getComments(
            @PathVariable Long blogId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(commentService.getComments(blogId, page, size));
    }

    @PostMapping("/blogs/{blogId}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long blogId,
            @Valid @RequestBody CommentRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(commentService.addComment(blogId, request, user));
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long id,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        commentService.deleteComment(id, user);
        return ResponseEntity.ok().build();
    }
}
