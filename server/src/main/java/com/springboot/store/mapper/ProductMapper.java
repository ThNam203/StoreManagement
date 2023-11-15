package com.springboot.store.mapper;

import com.springboot.store.entity.Media;
import com.springboot.store.entity.Product;
import com.springboot.store.payload.ProductDTO;
import com.springboot.store.payload.ProductPropertyDTO;
import com.springboot.store.payload.SalesUnitsDTO;

import java.util.stream.Collectors;

public class ProductMapper {
    public static ProductDTO toProductDTO(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .barcode(product.getBarcode())
                .location(product.getLocation().getName())
                .originalPrice(product.getOriginalPrices().get(product.getOriginalPrices().size() - 1).getValue())
                .productPrice(product.getProductPrices().get(product.getProductPrices().size() - 1).getValue())
                .stock(product.getStock())
                .status(product.getStatus())
                .description(product.getDescription())
                .note(product.getNote())
                .weight(product.getWeight())
                .minStock(product.getMinStock())
                .maxStock(product.getMaxStock())
                .images(product.getImages() != null ?
                        product.getImages().stream().map(Media::getUrl).collect(Collectors.toList()) : null)
                .productProperties(product.getProperties() != null ? product.getProperties().stream().map(productProperty -> ProductPropertyDTO.builder()
                        .id(productProperty.getId())
                        .propertyName(productProperty.getPropertyName().getName())
                        .propertyValue(productProperty.getPropertyValue())
                        .build()).collect(Collectors.toList()) : null)
                .salesUnits(SalesUnitsDTO.builder()
                        .id(product.getSalesUnits().getId())
                        .name(product.getSalesUnits().getName())
                        .basicUnit(product.getSalesUnits().getBasicUnit())
                        .exchangeValue(product.getSalesUnits().getExchangeValue())
                        .build())
                .productGroup(product.getProductGroup() != null ?
                        product.getProductGroup().getName() : null)
                .productBrand(product.getProductBrand() != null ?
                        product.getProductBrand().getName() : null)
                .build();
    }
    public static Product toProduct(ProductDTO productDTO) {
        return Product.builder()
                .id(productDTO.getId())
                .name(productDTO.getName())
                .barcode(productDTO.getBarcode())
                .description(productDTO.getDescription())
                .note(productDTO.getNote())
                .minStock(productDTO.getMinStock())
                .maxStock(productDTO.getMaxStock())
                .stock(productDTO.getStock())
                .status(productDTO.getStatus())
                .build();
    }
}
