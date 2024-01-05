package com.springboot.store.payload;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.springboot.store.utils.DiscountE;
import lombok.*;

import java.util.Date;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class DiscountDTO {
    private int id;
    private String name;
    private String description;
    private boolean status;
    private double value;
    private DiscountE type;
    private Integer maxValue;
    private int minSubTotal;
    private int amount;
    private Integer creatorId;
    private Set<DiscountCodeDTO> discountCodes;
    private Set<Integer> productIds;
    private Set<String> productGroups;
    private Date startDate;
    private Date endDate;
    private Date createdAt;
}
