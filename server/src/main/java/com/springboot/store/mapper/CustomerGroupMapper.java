package com.springboot.store.mapper;

import com.springboot.store.entity.CustomerGroup;
import com.springboot.store.payload.CustomerGroupDTO;

public class CustomerGroupMapper {
    public static CustomerGroupDTO toCustomerGroupDTO(CustomerGroup customerGroup) {
        CustomerGroupDTO customerGroupDTO = new CustomerGroupDTO();
        customerGroupDTO.setId(customerGroup.getId());
        customerGroupDTO.setName(customerGroup.getName());
        customerGroupDTO.setDescription(customerGroup.getDescription());
        customerGroupDTO.setCreatedAt(customerGroup.getCreatedAt());
        if (customerGroup.getCreator() != null) {
            customerGroupDTO.setCreator(customerGroup.getCreator().getId());
        }
        if (customerGroup.getCustomers() != null) {
            customerGroupDTO.setCustomerId(customerGroup.getCustomers().stream().map(com.springboot.store.entity.Customer::getId).collect(java.util.stream.Collectors.toSet()));
        }
        return customerGroupDTO;
    }
    public static CustomerGroup toCustomerGroup(CustomerGroupDTO customerGroupDTO) {
        CustomerGroup customerGroup = new CustomerGroup();
        customerGroup.setName(customerGroupDTO.getName());
        customerGroup.setDescription(customerGroupDTO.getDescription());
        return customerGroup;
    }
}
