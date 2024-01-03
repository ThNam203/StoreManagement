package com.springboot.store.service.impl;

import com.springboot.store.payload.MessageDTO;
import com.springboot.store.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final SimpMessagingTemplate simpMessagingTemplate;
    @Override
    public void notifyLowStock(int productId, int stock) {
        String message = String.format("Product with id %d is running low on stock. Current stock: %d", productId, stock);
        MessageDTO messageDTO = MessageDTO.builder()
                .message(message)
                .date(new Date())
                .build();
        simpMessagingTemplate.convertAndSend("/topic/all", messageDTO);
    }
}
