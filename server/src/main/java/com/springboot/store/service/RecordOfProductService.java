package com.springboot.store.service;

import com.springboot.store.payload.RecordOfProductDTO;
import com.springboot.store.payload.RecordOfProductSellDTO;

import java.util.Date;
import java.util.List;

public interface RecordOfProductService {
    List<RecordOfProductDTO> getAllRecordOfProduct(Date startDate, Date endDate);
}
