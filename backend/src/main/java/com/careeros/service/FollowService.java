package com.careeros.service;

import com.careeros.entity.Follow;
import com.careeros.entity.User;
import com.careeros.entity.NotificationType;
import com.careeros.repository.FollowRepository;
import com.careeros.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FollowService {
    
    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    
    @Transactional
    public void followUser(Long userId, User follower) {
        if (follower.getId().equals(userId)) {
            throw new RuntimeException("You cannot follow yourself");
        }
        
        User following = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (followRepository.existsByFollowerAndFollowing(follower, following)) {
            throw new RuntimeException("Already following this user");
        }
        
        Follow follow = new Follow();
        follow.setFollower(follower);
        follow.setFollowing(following);
        followRepository.save(follow);
        
        // Trigger notification
        notificationService.createNotification(following, follower, NotificationType.FOLLOW, null);
    }
    
    @Transactional
    public void unfollowUser(Long userId, User follower) {
        User following = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Follow follow = followRepository.findByFollowerAndFollowing(follower, following)
            .orElseThrow(() -> new RuntimeException("Not following this user"));
        
        followRepository.delete(follow);
    }
    
    public boolean isFollowing(Long userId, User follower) {
        User following = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return followRepository.existsByFollowerAndFollowing(follower, following);
    }
    
    public long getFollowersCount(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return followRepository.countByFollowing(user);
    }
    
    public long getFollowingCount(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return followRepository.countByFollower(user);
    }
}