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
import com.springboot.store.service.ActivityLogService;
import com.springboot.store.service.NotificationService;
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
    private final ActivityLogService activityLogService;
    private final NotificationService notificationService;

    @Override
    public List<StockCheckDTO> getAllStockChecks() {
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        List<StockCheck> stockChecks = stockCheckRepository.findByStoreId(storeId);
        return stockChecks.stream().map(StockCheckMapper::toStockCheckDTO).toList();
    }

    @Override
    public StockCheckDTO getStockCheckById(int id) {
        StockCheck stockCheck = stockCheckRepository.findById(id).orElseThrow(() -> new CustomException("Stock check not found", HttpStatus.NOT_FOUND));
        return StockCheckMapper.toStockCheckDTO(stockCheck);
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
                        if (product.getStock() < product.getMinStock()) {
                            notificationService.notifyLowStock(product.getId(), product.getStock());
                        }
                        productRepository.save(product);
                        stockCheckDetail.setProduct(product);
                        stockCheckDetail.setStockCheck(stockCheck);
                        return stockCheckDetail;
                    })
                    .collect(Collectors.toList());
            stockCheck.setProducts(stockCheckDetails);
        }

        StockCheck stockCheckNew = stockCheckRepository.save(stockCheck);
        activityLogService.save("created a stock check with id " + stockCheckNew.getId(), staffService.getAuthorizedStaff().getId(), new Date());
        return StockCheckMapper.toStockCheckDTO(stockCheckNew);
    }

    @Override
    public StockCheckDTO updateStockCheck(int id, StockCheckDTO stockCheckDTO) {
        StockCheck stockCheck = stockCheckRepository.findById(id).orElseThrow(() -> new CustomException("Stock check not found", HttpStatus.NOT_FOUND));
        stockCheck.setNote(stockCheckDTO.getNote());
        if (stockCheckDTO.getProducts() != null) {
            stockCheck.getProducts().forEach(stockCheckDetail -> {
                Product product = productRepository.findById(stockCheckDetail.getProduct().getId()).orElseThrow(() -> new CustomException("Product not found", HttpStatus.NOT_FOUND));
                product.setStock(product.getStock() - stockCheckDetail.getCountedStock());
                productRepository.save(product);
            });

            List<StockCheckDetail> stockCheckDetails = stockCheckDTO.getProducts()
                    .stream()
                    .map(stockCheckDetailDTO -> {
                        StockCheckDetail stockCheckDetail = StockCheckDetailMapper.toStockCheckDetail(stockCheckDetailDTO);
                        Product product = productRepository.findById(stockCheckDetailDTO.getProductId())
                                .orElseThrow(() -> new CustomException("Product not found with id" + stockCheckDetailDTO.getProductId(), HttpStatus.NOT_FOUND));
                        product.setStock(stockCheckDetail.getCountedStock());
                        if (product.getStock() < product.getMinStock()) {
                            notificationService.notifyLowStock(product.getId(), product.getStock());
                        }
                        productRepository.save(product);
                        stockCheckDetail.setProduct(product);
                        stockCheckDetail.setStockCheck(stockCheck);
                        return stockCheckDetail;
                    })
                    .toList();
            stockCheck.getProducts().clear();
            stockCheck.getProducts().addAll(stockCheckDetails);
        }
        StockCheck stockCheckNew = stockCheckRepository.save(stockCheck);
        activityLogService.save("updated a stock check with id " + stockCheckNew.getId(), staffService.getAuthorizedStaff().getId(), new Date());
        return StockCheckMapper.toStockCheckDTO(stockCheckNew);
    }

    @Override
    public void deleteStockCheck(int id) {
        StockCheck stockCheck = stockCheckRepository.findById(id).orElseThrow(() -> new CustomException("Stock check not found", HttpStatus.NOT_FOUND));
        stockCheckRepository.delete(stockCheck);
        activityLogService.save("deleted a stock check with id " + id, staffService.getAuthorizedStaff().getId(), new Date());
    }
}