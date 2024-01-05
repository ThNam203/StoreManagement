package com.springboot.store.payload;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.util.Date;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierGroupDTO {
    private int id;
    private String name;
    private String description;
    private String address;
    private String company;
    private Date createdAt;
    private Integer creatorId;
}
