package com.springboot.store.payload;

import com.springboot.store.entity.Staff;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.Date;

@Data
public class StaffDto {
    private int id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotEmpty(message = "Email is required")
    @Email(message = "Email is invalid")
    private String email;

    private String address;
    private String phoneNumber;
    private String facebook;
    private String avatar;
    private String description;
    private String sex;
    private Date birthday;
    private Date createdAt;
    private Staff creator;
}
