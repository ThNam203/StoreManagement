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
    private int maxTotal;
    private int minTotal;
    private int amount;
    private int creatorId;
    private Set<String> discountCodes;
    private Set<Integer> productIds;
    private Set<String> productGroups;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date startDate;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date endDate;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createdAt;
}
