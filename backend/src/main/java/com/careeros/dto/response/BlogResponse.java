package com.careeros.dto.response;

import com.careeros.entity.Blog;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BlogResponse {
    private Long id;
    private String title;
    private String subtitle;
    private String content;
    private String category;
    private String tags;
    private String coverImage;
    private Integer readingTime;
    private int viewCount;
    private int likeCount;
    private int commentCount;
    private int shareCount;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserResponse author;
    private boolean likedByCurrentUser;
    private boolean bookmarkedByCurrentUser;
    
    public static BlogResponse fromBlog(Blog blog) {
        BlogResponse response = new BlogResponse();
        response.setId(blog.getId());
        response.setTitle(blog.getTitle());
        response.setSubtitle(blog.getSubtitle());
        response.setContent(blog.getContent());
        response.setCategory(blog.getCategory());
        response.setTags(blog.getTags());
        response.setCoverImage(blog.getCoverImage());
        response.setReadingTime(blog.getReadingTime());
        response.setViewCount(blog.getViewCount());
        response.setLikeCount(blog.getLikeCount());
        response.setCommentCount(blog.getCommentCount());
        response.setShareCount(blog.getShareCount());
        response.setStatus(blog.getStatus().name());
        response.setCreatedAt(blog.getCreatedAt());
        response.setUpdatedAt(blog.getUpdatedAt());
        
        if (blog.getAuthor() != null) {
            response.setAuthor(UserResponse.fromUser(blog.getAuthor()));
        }
        
        return response;
    }
}