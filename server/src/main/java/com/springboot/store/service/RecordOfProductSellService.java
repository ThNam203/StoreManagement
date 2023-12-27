package com.springboot.store.service;

import com.springboot.store.payload.RecordOfProductSellDTO;

import java.util.Date;
import java.util.List;

public interface RecordOfProductSellService {
    List<RecordOfProductSellDTO> getAllRecordOfProductSell(Date date);
}
