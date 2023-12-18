package com.springboot.store.service.impl;

import com.springboot.store.entity.Product;
import com.springboot.store.entity.StockCheck;
import com.springboot.store.entity.StockCheckDetail;
import com.springboot.store.exception.CustomException;
import com.springboot.store.mapper.StockCheckDetailMapper;
import com.springboot.store.mapper.StockCheckMapper;
import com.springboot.store.payload.StockCheckDTO;
import com.springboot.store.repository.ProductRepository;
import com.springboot.store.repository.StockCheckRepository;
import com.springboot.store.service.StaffService;
import com.springboot.store.service.StockCheckService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StockCheckServiceImpl implements StockCheckService {
    private final StaffService staffService;
    private final StockCheckRepository stockCheckRepository;
    private final ProductRepository productRepository;
    @Override
    public List<StockCheckDTO> getAllStockChecks() {
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        List<StockCheck> stockChecks = updatePropertyName(stockCheckRepository.findByStoreId(storeId));
        stockCheckRepository.saveAll(stockChecks);
        return stockChecks.stream().map(StockCheckMapper::toStockCheckDTO).toList();
    }

    @Override
    public StockCheckDTO getStockCheckById(int id) {
        StockCheck stockCheck = stockCheckRepository.findById(id).orElseThrow(() -> new CustomException("Stock check not found", HttpStatus.NOT_FOUND));
        stockCheck = updatePropertyName(List.of(stockCheck)).get(0);
        stockCheckRepository.save(stockCheck);
        return StockCheckMapper.toStockCheckDTO(stockCheck);
    }

    private List<StockCheck> updatePropertyName(List<StockCheck> stockChecks) {
        stockChecks.forEach(stockCheck -> {
            if (stockCheck.getProducts() != null) {
                stockCheck.getProducts().forEach(stockCheckDetail -> {
                    if (stockCheckDetail.getProduct() != null) {
                        stockCheckDetail.setProductName(stockCheckDetail.getProduct().getName());
                        stockCheckDetail.setProductProperties(stockCheckDetail.getProduct().propertiesToString());
                    }
                });
            }
        });
        return stockChecks;
    }

    @Override
    public StockCheckDTO createStockCheck(StockCheckDTO stockCheckDTO) {
        StockCheck stockCheck = StockCheckMapper.toStockCheck(stockCheckDTO);
        stockCheck.setCreatedDate(new Date());
        stockCheck.setCreator(staffService.getAuthorizedStaff());
        stockCheck.setStore(staffService.getAuthorizedStaff().getStore());

        if (stockCheckDTO.getProducts() != null) {
            List<StockCheckDetail> stockCheckDetails = stockCheckDTO.getProducts()
                    .stream()
                    .map(stockCheckDetailDTO -> {
                        StockCheckDetail stockCheckDetail = StockCheckDetailMapper.toStockCheckDetail(stockCheckDetailDTO);
                        Product product = productRepository.findById(stockCheckDetailDTO.getProductId())
                                .orElseThrow(() -> new CustomException("Product not found with id" + stockCheckDetailDTO.getProductId(), HttpStatus.NOT_FOUND));
                        product.setStock(stockCheckDetail.getCountedStock());
                        productRepository.save(product);
                        stockCheckDetail.setProduct(product);
                        stockCheckDetail.setStockCheck(stockCheck);
                        return stockCheckDetail;
                    })
                    .collect(Collectors.toList());
            stockCheck.setProducts(stockCheckDetails);
        }

        StockCheck stockCheckNew = stockCheckRepository.save(stockCheck);
        return StockCheckMapper.toStockCheckDTO(stockCheckNew);
    }

    @Override
    public StockCheckDTO updateStockCheck(int id, StockCheckDTO stockCheckDTO) {
        StockCheck stockCheck = stockCheckRepository.findById(id).orElseThrow(() -> new CustomException("Stock check not found", HttpStatus.NOT_FOUND));
        stockCheck.setNote(stockCheckDTO.getNote());
        if (stockCheckDTO.getProducts() != null) {
            List<StockCheckDetail> stockCheckDetails = stockCheckDTO.getProducts()
                    .stream()
                    .map(stockCheckDetailDTO -> {
                        StockCheckDetail stockCheckDetail = StockCheckDetailMapper.toStockCheckDetail(stockCheckDetailDTO);
                        stockCheckDetail.setProduct(productRepository.findById(stockCheckDetailDTO.getProductId())
                                .orElseThrow(() -> new CustomException("Product not found with id" + stockCheckDetailDTO.getProductId(), HttpStatus.NOT_FOUND)));
                        stockCheckDetail.setStockCheck(stockCheck);
                        return stockCheckDetail;
                    })
                    .toList();
            stockCheck.getProducts().clear();
            stockCheck.getProducts().addAll(stockCheckDetails);
        }
        StockCheck stockCheckNew = stockCheckRepository.save(stockCheck);
        return StockCheckMapper.toStockCheckDTO(stockCheckNew);
    }

    @Override
    public void deleteStockCheck(int id) {
        StockCheck stockCheck = stockCheckRepository.findById(id).orElseThrow(() -> new CustomException("Stock check not found", HttpStatus.NOT_FOUND));
        stockCheckRepository.delete(stockCheck);
    }
}