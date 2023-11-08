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
    private String property;
    private Location location;
    private int originalPrice;
    private int productPrice;
    private int quantity;
    private String status;
    private String description;
    private String note;
    private int minStock;
    private int maxStock;
    private String locationName;

    private List<String> images;
    private List<ProductPropertyDTO> productProperties;
    private SalesUnitsDTO salesUnits;
    private ProductGroupDTO productGroup;
}
