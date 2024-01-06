package com.springboot.store.service;

import com.springboot.store.entity.Staff;
import com.springboot.store.payload.StaffRequest;
import com.springboot.store.payload.StaffResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;

public interface StaffService {
    StaffResponse createStaff(StaffRequest newStaff, MultipartFile file);

    List<StaffResponse> getAllStaffs();

    StaffResponse getStaffById(int id);

    StaffResponse updateStaff(int id, StaffRequest staffRequest, MultipartFile file);

    void deleteStaff(int id);

    StaffResponse getStaffSalary(int id);

    int getStaffSalaryInDate(Date startDate, Date endDate);

    double getStaffBonusInDate(Date startDate, Date endDate);

    double getStaffPunishInDate(Date startDate, Date endDate);

    Staff findByEmail(String email);

    Staff getAuthorizedStaff();
}
