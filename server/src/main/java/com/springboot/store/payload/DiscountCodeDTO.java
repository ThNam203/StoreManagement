package com.springboot.store.payload;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DiscountCodeDTO {
    private int id;
    private String value;
    private Date issuedDate;
    private Date usedDate;
    private boolean status;
}
