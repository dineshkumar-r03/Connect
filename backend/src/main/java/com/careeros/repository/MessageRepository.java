package com.careeros.repository;

import com.careeros.entity.Message;
import com.careeros.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT DISTINCT m.sender FROM Message m WHERE m.recipient.id = :userId")
    List<User> findSendersByRecipientId(@Param("userId") Long userId);

    @Query("SELECT DISTINCT m.recipient FROM Message m WHERE m.sender.id = :userId")
    List<User> findRecipientsBySenderId(@Param("userId") Long userId);

    @Query("SELECT m FROM Message m WHERE (m.sender.id = :userId1 AND m.recipient.id = :userId2) OR (m.sender.id = :userId2 AND m.recipient.id = :userId1) ORDER BY m.createdAt ASC")
    List<Message> findChatHistory(@Param("userId1") Long userId1, @Param("userId2") Long userId2);

    @Query("SELECT m FROM Message m WHERE (m.sender.id = :userId1 AND m.recipient.id = :userId2) OR (m.sender.id = :userId2 AND m.recipient.id = :userId1) ORDER BY m.createdAt DESC")
    List<Message> findLastMessage(@Param("userId1") Long userId1, @Param("userId2") Long userId2, Pageable pageable);

    long countBySenderAndRecipientAndIsReadFalse(User sender, User recipient);
}
