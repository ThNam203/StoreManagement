package com.springboot.store.service.impl;

import com.springboot.store.entity.Customer;
import com.springboot.store.entity.CustomerGroup;
import com.springboot.store.entity.Media;
import com.springboot.store.entity.Staff;
import com.springboot.store.payload.CustomerDTO;
import com.springboot.store.repository.CustomerGroupRepository;
import com.springboot.store.repository.CustomerRepository;
import com.springboot.store.repository.StaffRepository;
import com.springboot.store.service.CustomerService;
import com.springboot.store.service.FileService;
import com.springboot.store.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;

// updated store
@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {
    private final CustomerRepository customerRepository;
    private final FileService fileService;
    private final CustomerGroupRepository customerGroupRepository;
    private final StaffRepository staffRepository;
    private final StaffService staffService;
    private final ModelMapper modelMapper;

    @Override
    public List<CustomerDTO> getAllCustomers() {
        Staff staff = staffService.getAuthorizedStaff();
        List<Customer> customers = customerRepository.findByStoreId(staff.getStore().getId());
        return customers.stream()
                .map(customer -> {
                    CustomerDTO customerDTO = modelMapper.map(customer, CustomerDTO.class);
                    customerDTO.setCreator(Integer.toString(customer.getCreator().getId()));
                    customerDTO.setCustomerGroup(customer.getCustomerGroup().getName());
                    return customerDTO;
                })
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public CustomerDTO createCustomer(CustomerDTO customerDTO, MultipartFile file) {
        Staff staff = staffService.getAuthorizedStaff();
        customerDTO.setCreator(staffService.getAuthorizedStaff().getName());
        Customer customer = modelMapper.map(customerDTO, Customer.class);
        CustomerGroup customerGroup = customerGroupRepository.findByNameAndStoreId(customerDTO.getCustomerGroup(), staff.getStore().getId());
        if (customerGroup == null) {
            throw new RuntimeException("Customer group not found with name: " + customerDTO.getCustomerGroup());
        }
        customer.setCustomerGroup(customerGroup);
        if (!file.isEmpty()) {
            String fileName = fileService.uploadFile(file);
            Media media = Media.builder().url(fileName).build();
            customer.setImage(media);
        }
        customer.setCreatedAt(new Date());
        customer.setCreator(staff);
        customer.setStore(staff.getStore());
        customer = customerRepository.save(customer);
        customerDTO = modelMapper.map(customer, CustomerDTO.class);
        customerDTO.setCreator(Integer.toString(customer.getCreator().getId()));
        customerDTO.setCustomerGroup(customer.getCustomerGroup().getName());
        return customerDTO;
    }

    @Override
    public CustomerDTO updateCustomer(int id, CustomerDTO customerDTO, MultipartFile file) {
        Customer customer = customerRepository.findById(id).orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        Staff staff = staffService.getAuthorizedStaff();
        if (!customer.getCustomerGroup().getName().equals(customerDTO.getCustomerGroup())) {
            CustomerGroup customerGroup = customerGroupRepository.findByNameAndStoreId(customerDTO.getCustomerGroup(), staff.getStore().getId());
            if (customerGroup == null) {
                throw new RuntimeException("Customer group not found with name: " + customerDTO.getCustomerGroup());
            }
            customer.setCustomerGroup(customerGroup);
        }
        if (!file.isEmpty()) {
            String fileName = fileService.uploadFile(file);
            Media media = Media.builder().url(fileName).build();
            customer.setImage(media);
        }
        customer.setName(customerDTO.getName());
        customer.setAddress(customerDTO.getAddress());
        customer.setBirthday(customerDTO.getBirthday());
        customer.setDescription(customerDTO.getDescription());
        customer.setEmail(customerDTO.getEmail());
        customer.setPhoneNumber(customerDTO.getPhoneNumber());
        customer.setSex(customerDTO.getSex());
        customer.setStatus(customerDTO.getStatus());
        customer = customerRepository.save(customer);

        customerDTO = modelMapper.map(customer, CustomerDTO.class);
        customerDTO.setCreator(Integer.toString(customer.getCreator().getId()));
        customerDTO.setCustomerGroup(customer.getCustomerGroup().getName());
        return customerDTO;
    }

    @Override
    public CustomerDTO getCustomerById(int id) {
        Customer customer = customerRepository.findById(id).orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        CustomerDTO customerDTO = modelMapper.map(customer, CustomerDTO.class);
        customerDTO.setCreator(Integer.toString(customer.getCreator().getId()));
        customerDTO.setCustomerGroup(customer.getCustomerGroup().getName());
        return customerDTO;
    }

    @Override
    public void deleteCustomer(int id) {
        customerRepository.deleteById(id);
    }
}
