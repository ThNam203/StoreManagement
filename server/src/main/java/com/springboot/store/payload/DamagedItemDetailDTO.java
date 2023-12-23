package com.springboot.store.payload;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DamagedItemDetailDTO {
    private int id;
    private Integer productId;
    private int damagedQuantity;
}
