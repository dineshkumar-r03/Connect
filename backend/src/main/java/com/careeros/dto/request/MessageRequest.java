package com.careeros.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class MessageRequest {
    @NotNull(message = "Recipient is required")
    private Long recipientId;

    @NotBlank(message = "Message content cannot be blank")
    @Size(max = 2000, message = "Message must be less than 2000 characters")
    private String content;
}
