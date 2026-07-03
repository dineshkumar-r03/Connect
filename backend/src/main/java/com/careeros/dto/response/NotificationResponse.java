package com.careeros.dto.response;

import com.careeros.entity.Notification;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationResponse {
    private Long id;
    private Long senderId;
    private String senderName;
    private String senderProfilePicture;
    private String type;
    private Long blogId;
    private String blogTitle;
    private boolean isRead;
    private LocalDateTime createdAt;

    public static NotificationResponse fromNotification(Notification notification) {
        NotificationResponse response = new NotificationResponse();
        response.setId(notification.getId());
        
        if (notification.getSender() != null) {
            response.setSenderId(notification.getSender().getId());
            response.setSenderName(notification.getSender().getName());
            response.setSenderProfilePicture(notification.getSender().getProfilePicture());
        }
        
        response.setType(notification.getType().name());
        
        if (notification.getRelatedBlog() != null) {
            response.setBlogId(notification.getRelatedBlog().getId());
            response.setBlogTitle(notification.getRelatedBlog().getTitle());
        }
        
        response.setRead(notification.isRead());
        response.setCreatedAt(notification.getCreatedAt());
        return response;
    }
}
