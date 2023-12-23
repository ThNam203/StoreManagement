package com.springboot.store.payload;

import com.springboot.store.entity.Product;
import lombok.*;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockCheckDetailDTO {
    private int id;
    private Integer productId;
    private String productName;
    private String productProperties;
    private int countedStock;
    private int realStock;
    private int price;
}
