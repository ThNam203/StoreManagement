package com.springboot.store.service;

import com.springboot.store.payload.CustomerGroupDTO;

import java.util.List;

public interface CustomerGroupService {
    CustomerGroupDTO createCustomerGroup(CustomerGroupDTO customerGroupDTO);

    CustomerGroupDTO updateCustomerGroup(int id, CustomerGroupDTO customerGroupDTO);

    List<CustomerGroupDTO> getAllCustomerGroups();

    CustomerGroupDTO getCustomerGroupById(int id);

    void deleteCustomerGroup(int id);
}
