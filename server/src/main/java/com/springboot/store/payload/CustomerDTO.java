package com.springboot.store.payload;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.springboot.store.entity.Media;
import lombok.*;

import java.util.Date;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDTO {
    private int id;
    private String name;
    private String email;
    private String phoneNumber;
    private String address;
    private String sex;
    private String description;
    private String status;
    private Date birthday;
    private Boolean isDeleted;
    private Date createdAt;
    private String customerGroup;
    private Integer creatorId;
    private Media image;
}
