package com.springboot.store.payload;

import lombok.*;

import java.util.Date;
import java.util.Set;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerGroupDTO {
    private int id;
    private String name;
    private String description;
    private Date createdAt;
    private Integer creator;
    private Set<Integer> customerId;
}
