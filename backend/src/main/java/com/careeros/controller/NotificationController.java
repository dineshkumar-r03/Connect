package com.careeros.controller;

import com.careeros.dto.response.ApiResponse;
import com.careeros.dto.response.NotificationResponse;
import com.careeros.entity.User;
import com.careeros.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        return ResponseEntity.ok(notificationService.getNotificationsForUser(currentUser));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        return ResponseEntity.ok(notificationService.getUnreadCount(currentUser));
    }

    @PostMapping("/mark-read")
    public ResponseEntity<ApiResponse> markAllAsRead(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        notificationService.markAllAsRead(currentUser);
        return ResponseEntity.ok(new ApiResponse(true, "All notifications marked as read"));
    }

    @PostMapping("/{id}/mark-read")
    public ResponseEntity<ApiResponse> markAsRead(@PathVariable Long id, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        notificationService.markAsRead(id, currentUser);
        return ResponseEntity.ok(new ApiResponse(true, "Notification marked as read"));
    }
}
