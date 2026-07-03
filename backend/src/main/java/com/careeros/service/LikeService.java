package com.careeros.service;

import com.careeros.entity.Blog;
import com.careeros.entity.Like;
import com.careeros.entity.User;
import com.careeros.entity.NotificationType;
import com.careeros.repository.BlogRepository;
import com.careeros.repository.LikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LikeService {
    
    private final LikeRepository likeRepository;
    private final BlogRepository blogRepository;
    private final NotificationService notificationService;
    
    @Transactional
    public void likeBlog(Long blogId, User user) {
        Blog blog = blogRepository.findById(blogId)
            .orElseThrow(() -> new RuntimeException("Blog not found"));
        
        if (likeRepository.existsByUserAndBlog(user, blog)) {
            throw new RuntimeException("You already liked this blog");
        }
        
        Like like = new Like();
        like.setUser(user);
        like.setBlog(blog);
        likeRepository.save(like);
        
        blog.incrementLikeCount();
        blogRepository.save(blog);
        
        // Trigger notification
        notificationService.createNotification(blog.getAuthor(), user, NotificationType.LIKE, blog);
    }
    
    @Transactional
    public void unlikeBlog(Long blogId, User user) {
        Blog blog = blogRepository.findById(blogId)
            .orElseThrow(() -> new RuntimeException("Blog not found"));
        
        Like like = likeRepository.findByUserAndBlog(user, blog)
            .orElseThrow(() -> new RuntimeException("You haven't liked this blog"));
        
        likeRepository.delete(like);
        
        blog.decrementLikeCount();
        blogRepository.save(blog);
    }
    
    public boolean hasLiked(Long blogId, User user) {
        Blog blog = blogRepository.findById(blogId)
            .orElseThrow(() -> new RuntimeException("Blog not found"));
        return likeRepository.existsByUserAndBlog(user, blog);
    }
}