package com.springboot.store.service;

import com.springboot.store.payload.report.RecordOfSupplierDTO;

import java.util.Date;
import java.util.List;

public interface RecordOfSupplierService {
    List<RecordOfSupplierDTO> getAllRecordOfSupplier(Date startDate, Date endDate);
}
