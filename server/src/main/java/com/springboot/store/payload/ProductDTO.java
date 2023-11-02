package com.springboot.store.payload;

import com.springboot.store.entity.SalesUnits;
import lombok.*;

import java.util.Set;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private int id;
    private String name;
    private String barcode;
    private String property;
    private String location;
    private int originalPrice;
    private int quantity;
    private String status;
    private String description;
    private String note;
    private int minStock;
    private int maxStock;

    private Set<String> images;
    private Set<ProductPriceDTO> productPrices;
    private ProductGroupDTO productGroup;
    private SalesUnitsDTO salesUnits;
}
