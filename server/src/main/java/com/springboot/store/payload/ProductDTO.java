package com.springboot.store.payload;

import com.springboot.store.entity.Location;
import com.springboot.store.entity.SalesUnits;
import lombok.*;

import java.util.List;
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
    private String status;
    private String description;
    private String note;
    private String weight;
    private int stock;
    private int minStock;
    private int maxStock;

    private String location;
    private String productGroup;
    private String productBrand;
    private int originalPrice;
    private int productPrice;

    private List<String> images;
    private List<ProductPropertyDTO> productProperties;
    private SalesUnitsDTO salesUnits;
}
