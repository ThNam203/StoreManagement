package com.springboot.store.payload;

import java.util.Date;
import java.util.Set;

public class ProductGroupDTO {
    private int id;
    private String name;
    private String description;
    private Date createdAt;
    private Set<ProductDTO> products;
}
