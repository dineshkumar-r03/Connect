package com.careeros.dto.response;

import com.careeros.entity.Comment;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class CommentResponse {
    private Long id;
    private String content;
    private int likeCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserResponse user;
    private Long blogId;
    private Long parentId;
    private List<CommentResponse> replies;
    private boolean likedByCurrentUser;
    
    public static CommentResponse fromComment(Comment comment) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setContent(comment.getContent());
        response.setLikeCount(comment.getLikeCount());
        response.setCreatedAt(comment.getCreatedAt());
        response.setUpdatedAt(comment.getUpdatedAt());
        
        if (comment.getUser() != null) {
            response.setUser(UserResponse.fromUser(comment.getUser()));
        }
        
        if (comment.getBlog() != null) {
            response.setBlogId(comment.getBlog().getId());
        }
        
        if (comment.getParent() != null) {
            response.setParentId(comment.getParent().getId());
        }
        
        // Note: replies are lazy - don't access them here. Fetch them with a separate query if needed.
        
        return response;
    }
}