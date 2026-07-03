package com.careeros.service;

import com.careeros.dto.response.NotificationResponse;
import com.careeros.entity.Blog;
import com.careeros.entity.Notification;
import com.careeros.entity.NotificationType;
import com.careeros.entity.User;
import com.careeros.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public void createNotification(User recipient, User sender, NotificationType type, Blog blog) {
        // Do not create notification if the recipient is the sender (e.g. self-like, self-comment)
        if (recipient.getId().equals(sender.getId())) {
            return;
        }

        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setSender(sender);
        notification.setType(type);
        notification.setRelatedBlog(blog);
        notification.setRead(false);

        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotificationsForUser(User user) {
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(user).stream()
                .map(NotificationResponse::fromNotification)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(User user) {
        return notificationRepository.countByRecipientAndIsReadFalse(user);
    }

    @Transactional
    public void markAllAsRead(User user) {
        List<Notification> unread = notificationRepository.findByRecipientOrderByCreatedAtDesc(user).stream()
                .filter(n -> !n.isRead())
                .peek(n -> n.setRead(true))
                .collect(Collectors.toList());
        if (!unread.isEmpty()) {
            notificationRepository.saveAll(unread);
        }
    }

    @Transactional
    public void markMessageNotificationsAsRead(User recipient, User sender) {
        List<Notification> unreadMessageNotifications = notificationRepository
                .findByRecipientAndSenderAndTypeAndIsReadFalse(recipient, sender, NotificationType.MESSAGE);
        if (!unreadMessageNotifications.isEmpty()) {
            unreadMessageNotifications.forEach(n -> n.setRead(true));
            notificationRepository.saveAll(unreadMessageNotifications);
        }
    }

    @Transactional
    public void markAsRead(Long id, User user) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        if (!notification.getRecipient().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to access this notification");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }
}
