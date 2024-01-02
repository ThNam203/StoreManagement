package com.springboot.store.payload;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.util.Date;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierDTO {
    private int id;
    private String name;
    private String address;
    private String phoneNumber;
    private String email;
    private String description;
    private String companyName;
    private Boolean isDeleted;
    private String status;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createdAt;
    private Integer creatorId;
    private String supplierGroupName;
    private String image;
}
