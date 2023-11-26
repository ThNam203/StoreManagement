package com.springboot.store.payload;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.springboot.store.entity.StaffSalary;
import com.springboot.store.utils.Role;
import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class StaffResponse {
    private int id;
    private String name;
    private String email;
    private String cccd;
    private String address;
    private String phoneNumber;
    private String avatar;
    private String note;
    private String sex;
    private String position;
    private int salaryDebt;
    private Date birthday;
    private Role role;
    private Date createdAt;
    private Integer creator;

    private StaffSalary staffSalary;
}
