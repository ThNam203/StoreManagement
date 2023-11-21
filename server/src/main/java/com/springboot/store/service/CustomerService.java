package com.springboot.store.service;

import com.springboot.store.payload.CustomerDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CustomerService {
    List<CustomerDTO> getAllCustomers();

    CustomerDTO createCustomer(CustomerDTO customerDTO, MultipartFile file);

    CustomerDTO updateCustomer(int id, CustomerDTO customerDTO, MultipartFile file);

    CustomerDTO getCustomerById(int id);

    void deleteCustomer(int id);

}
