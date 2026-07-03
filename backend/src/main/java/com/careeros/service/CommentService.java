package com.careeros.service;

import com.careeros.dto.request.CommentRequest;
import com.careeros.dto.response.CommentResponse;
import com.careeros.entity.Blog;
import com.careeros.entity.Comment;
import com.careeros.entity.User;
import com.careeros.entity.NotificationType;
import com.careeros.repository.BlogRepository;
import com.careeros.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommentService {
    
    private final CommentRepository commentRepository;
    private final BlogRepository blogRepository;
    private final NotificationService notificationService;
    
    @Transactional
    public CommentResponse addComment(Long blogId, CommentRequest request, User user) {
        Blog blog = blogRepository.findById(blogId)
            .orElseThrow(() -> new RuntimeException("Blog not found"));
        
        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setUser(user);
        comment.setBlog(blog);
        
        if (request.getParentId() != null) {
            Comment parent = commentRepository.findById(request.getParentId())
                .orElseThrow(() -> new RuntimeException("Parent comment not found"));
            comment.setParent(parent);
        }
        
        commentRepository.save(comment);
        blog.incrementCommentCount();
        blogRepository.save(blog);
        
        // Trigger notification
        notificationService.createNotification(blog.getAuthor(), user, NotificationType.COMMENT, blog);
        
        return CommentResponse.fromComment(comment);
    }
    
    public Page<CommentResponse> getComments(Long blogId, int page, int size) {
        Blog blog = blogRepository.findById(blogId)
            .orElseThrow(() -> new RuntimeException("Blog not found"));
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return commentRepository.findByBlogAndParentIsNullOrderByCreatedAtDesc(blog, pageable)
            .map(CommentResponse::fromComment);
    }
    
    @Transactional
    public void deleteComment(Long commentId, User user) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        if (!comment.getUser().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("You are not authorized to delete this comment");
        }
        
        Blog blog = comment.getBlog();
        blog.decrementCommentCount();
        blogRepository.save(blog);
        
        commentRepository.delete(comment);
    }
    
    @Transactional
    public void likeComment(Long commentId, User user) {
        // Implementation for liking comments
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Comment not found"));
        comment.incrementLikeCount();
        commentRepository.save(comment);
    }
    
    @Transactional
    public void unlikeComment(Long commentId, User user) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Comment not found"));
        comment.decrementLikeCount();
        commentRepository.save(comment);
    }
}