package com.springboot.store.service;

public interface NotificationService {
    void notifyLowStock(int productId, int stock );
}
