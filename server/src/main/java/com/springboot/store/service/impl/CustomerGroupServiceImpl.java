package com.springboot.store.service.impl;

import com.springboot.store.entity.Customer;
import com.springboot.store.entity.CustomerGroup;
import com.springboot.store.entity.Staff;
import com.springboot.store.mapper.CustomerGroupMapper;
import com.springboot.store.payload.CustomerGroupDTO;
import com.springboot.store.repository.CustomerGroupRepository;
import com.springboot.store.repository.CustomerRepository;
import com.springboot.store.service.CustomerGroupService;
import com.springboot.store.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

// updated store

@Service
@RequiredArgsConstructor
public class CustomerGroupServiceImpl implements CustomerGroupService {
    private final CustomerGroupRepository customerGroupRepository;
    private final StaffService staffService;
    private final CustomerRepository customerRepository;

    @Override
    public CustomerGroupDTO createCustomerGroup(CustomerGroupDTO customerGroupDTO) {
        if (customerGroupRepository.findByNameAndStoreId(customerGroupDTO.getName(), staffService.getAuthorizedStaff().getStore().getId()) != null) {
            throw new RuntimeException("Customer group name already exists");
        }
        CustomerGroup customerGroup = CustomerGroupMapper.toCustomerGroup(customerGroupDTO);
        customerGroup.setCreatedAt(new Date());
        customerGroup.setCreator(staffService.getAuthorizedStaff());
        customerGroup.setStore(staffService.getAuthorizedStaff().getStore());
        customerGroup = customerGroupRepository.save(customerGroup);

        return CustomerGroupMapper.toCustomerGroupDTO(customerGroup);

    }

    @Override
    public CustomerGroupDTO updateCustomerGroup(int id, CustomerGroupDTO customerGroupDTO) {
        if (customerGroupRepository.findByNameAndStoreId(customerGroupDTO.getName(), staffService.getAuthorizedStaff().getStore().getId()) != null) {
            throw new RuntimeException("Customer group name already exists");
        }
        CustomerGroup existingCustomerGroup = customerGroupRepository.findById(id).orElseThrow(() -> new RuntimeException("Customer group not found with id: " + id));
        existingCustomerGroup.setName(customerGroupDTO.getName());
        existingCustomerGroup.setDescription(customerGroupDTO.getDescription());
        existingCustomerGroup = customerGroupRepository.save(existingCustomerGroup);
        return CustomerGroupMapper.toCustomerGroupDTO(existingCustomerGroup);
    }

    @Override
    public List<CustomerGroupDTO> getAllCustomerGroups() {
        Staff staff = staffService.getAuthorizedStaff();
        List<CustomerGroup> customerGroups = customerGroupRepository.findByStoreId(staff.getStore().getId());
        return customerGroups.stream()
                .map(customerGroup -> {
                    CustomerGroupDTO customerGroupDTO = CustomerGroupMapper.toCustomerGroupDTO(customerGroup);
                    // check if creator is null
                    customerGroupDTO.setCreator(customerGroup.getCreator() == null ? null : customerGroup.getCreator().getId());
                    customerGroupDTO.setCustomerId(customerGroup.getCustomers().stream().map(Customer::getId).collect(java.util.stream.Collectors.toSet()));
                    return customerGroupDTO;
                })
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public CustomerGroupDTO getCustomerGroupById(int id) {
        CustomerGroup customerGroup = customerGroupRepository.findById(id).orElseThrow(() -> new RuntimeException("Customer group not found with id: " + id));
        return CustomerGroupMapper.toCustomerGroupDTO(customerGroup);
    }

    @Override
    public void deleteCustomerGroup(int id) {
        CustomerGroup customerGroup = customerGroupRepository.findById(id).orElseThrow(() -> new RuntimeException("Customer group not found with id: " + id));
        for (Customer customer : customerGroup.getCustomers()) {
            customer.setCustomerGroup(null);
            customerRepository.save(customer);
        }
        customerGroupRepository.deleteById(id);
    }
}
