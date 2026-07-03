package com.careeros.repository;

import com.careeros.entity.Notification;
import com.careeros.entity.NotificationType;
import com.careeros.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientOrderByCreatedAtDesc(User recipient);
    long countByRecipientAndIsReadFalse(User recipient);
    List<Notification> findByRecipientAndSenderAndTypeAndIsReadFalse(User recipient, User sender, NotificationType type);
}
