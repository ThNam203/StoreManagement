package com.springboot.store.service;

import com.springboot.store.payload.RecordOfSaleDTO;

import java.util.Date;
import java.util.List;

public interface RecordOfSaleService {
    List<RecordOfSaleDTO> getAllRecordOfSale(Date startDate, Date endDate);
}
