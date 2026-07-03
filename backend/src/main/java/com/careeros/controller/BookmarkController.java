package com.careeros.controller;

import com.careeros.dto.response.ApiResponse;
import com.careeros.dto.response.BlogResponse;
import com.careeros.entity.Blog;
import com.careeros.entity.User;
import com.careeros.service.BookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BookmarkController {
    
    private final BookmarkService bookmarkService;
    
    @PostMapping("/blogs/{id}/bookmark")
    public ResponseEntity<ApiResponse> bookmarkBlog(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        bookmarkService.bookmarkBlog(id, user);
        return ResponseEntity.ok(new ApiResponse(true, "Blog bookmarked successfully"));
    }
    
    @DeleteMapping("/blogs/{id}/bookmark")
    public ResponseEntity<ApiResponse> unbookmarkBlog(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        bookmarkService.unbookmarkBlog(id, user);
        return ResponseEntity.ok(new ApiResponse(true, "Blog unbookmarked successfully"));
    }
    
    @GetMapping("/bookmarks")
    public ResponseEntity<Page<BlogResponse>> getBookmarks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Page<Blog> bookmarks = bookmarkService.getUserBookmarks(user, page, size);
        return ResponseEntity.ok(bookmarks.map(BlogResponse::fromBlog));
    }
}