package com.springboot.store.mapper;

import com.springboot.store.entity.Customer;
import com.springboot.store.payload.CustomerDTO;

public class CustomerMapper {
    public static CustomerDTO toCustomerDTO(Customer customer) {
        CustomerDTO customerDTO = new CustomerDTO();
        customerDTO.setId(customer.getId());
        customerDTO.setName(customer.getName());
        customerDTO.setEmail(customer.getEmail());
        customerDTO.setPhoneNumber(customer.getPhoneNumber());
        customerDTO.setSex(customer.getSex());
        customerDTO.setDescription(customer.getDescription());
        customerDTO.setStatus(customer.getStatus());
        customerDTO.setBirthday(customer.getBirthday());
        customerDTO.setAddress(customer.getAddress());
        customerDTO.setCreatedAt(customer.getCreatedAt());
        if (customer.getCreator() != null) {
            customerDTO.setCreatorId(customer.getCreator().getId());
        }
        if (customer.getCustomerGroup() != null) {
            customerDTO.setCustomerGroup(customer.getCustomerGroup().getName());
        }
        if (customer.getImage() != null) {
            customerDTO.setImage(customer.getImage());
        }
        return customerDTO;
    }
    public static Customer toCustomer(CustomerDTO customerDTO) {
        Customer customer = new Customer();
        customer.setName(customerDTO.getName());
        customer.setEmail(customerDTO.getEmail());
        customer.setPhoneNumber(customerDTO.getPhoneNumber());
        customer.setSex(customerDTO.getSex());
        customer.setDescription(customerDTO.getDescription());
        customer.setStatus(customerDTO.getStatus());
        customer.setBirthday(customerDTO.getBirthday());
        customer.setAddress(customerDTO.getAddress());
        customer.setCreatedAt(customerDTO.getCreatedAt());
        return customer;
    }
}
