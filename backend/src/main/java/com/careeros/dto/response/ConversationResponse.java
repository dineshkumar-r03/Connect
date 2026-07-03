package com.careeros.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ConversationResponse {
    private UserResponse user;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private long unreadCount;
}
