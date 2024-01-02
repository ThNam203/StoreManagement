package com.springboot.store.service.impl;

import com.springboot.store.entity.Customer;
import com.springboot.store.entity.CustomerGroup;
import com.springboot.store.entity.Media;
import com.springboot.store.entity.Staff;
import com.springboot.store.mapper.CustomerMapper;
import com.springboot.store.payload.CustomerDTO;
import com.springboot.store.repository.CustomerGroupRepository;
import com.springboot.store.repository.CustomerRepository;
import com.springboot.store.repository.StaffRepository;
import com.springboot.store.service.ActivityLogService;
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
    private final ActivityLogService activityLogService;

    @Override
    public List<CustomerDTO> getAllCustomers() {
        Staff staff = staffService.getAuthorizedStaff();
        List<Customer> customers = customerRepository.findByStoreId(staff.getStore().getId());
        return customers.stream()
                .map(CustomerMapper::toCustomerDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public CustomerDTO createCustomer(CustomerDTO customerDTO, MultipartFile file) {

        if (!customerRepository.findByEmail(customerDTO.getEmail()).isEmpty()) {
            throw new RuntimeException("Email already exists");
        }

        Staff staff = staffService.getAuthorizedStaff();
        customerDTO.setCreatorId(staffService.getAuthorizedStaff().getId());
        Customer customer = CustomerMapper.toCustomer(customerDTO);
        customer.setIsDeleted(false);
        CustomerGroup customerGroup = customerGroupRepository.findByNameAndStoreId(customerDTO.getCustomerGroup(), staff.getStore().getId());
        if (customerGroup == null) {
            throw new RuntimeException("Customer group not found with name: " + customerDTO.getCustomerGroup());
        }
        customer.setCustomerGroup(customerGroup);
        if (file != null) {
            String fileName = fileService.uploadFile(file);
            if (fileName != null) {
                Media media = Media.builder().url(fileName).build();
                customer.setImage(media);
            }
        }
        customer.setCreatedAt(new Date());
        customer.setCreator(staff);
        customer.setStore(staff.getStore());
        customer = customerRepository.save(customer);
        activityLogService.save("created a customer with id " + customer.getId(), staff.getId(), new Date());
        return CustomerMapper.toCustomerDTO(customer);
    }

    @Override
    public CustomerDTO updateCustomer(int id, CustomerDTO customerDTO, MultipartFile file) {
        Customer customer = customerRepository.findById(id).orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));

        if (customer.getEmail() != null && !customer.getEmail().equals(customerDTO.getEmail())) {
            if (!customerRepository.findByEmail(customerDTO.getEmail()).isEmpty()) {
                throw new RuntimeException("Email already exists");
            }
        }

        Staff staff = staffService.getAuthorizedStaff();
        if (!customer.getCustomerGroup().getName().equals(customerDTO.getCustomerGroup())) {
            CustomerGroup customerGroup = customerGroupRepository.findByNameAndStoreId(customerDTO.getCustomerGroup(), staff.getStore().getId());
            if (customerGroup == null) {
                throw new RuntimeException("Customer group not found with name: " + customerDTO.getCustomerGroup());
            }
            customer.setCustomerGroup(customerGroup);
        }
        if (file != null) {
            String fileName = fileService.uploadFile(file);
            if (fileName != null) {
                Media media = Media.builder().url(fileName).build();
                customer.setImage(media);
            }
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
        activityLogService.save("updated a customer with id " + customer.getId(), staff.getId(), new Date());
        return CustomerMapper.toCustomerDTO(customer);
    }

    @Override
    public CustomerDTO getCustomerById(int id) {
        Customer customer = customerRepository.findById(id).orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        return CustomerMapper.toCustomerDTO(customer);
    }

    @Override
    public void deleteCustomer(int id) {
        Customer customer = customerRepository.findById(id).orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        customer.setIsDeleted(true);
        activityLogService.save("deleted a customer with id " + id, staffService.getAuthorizedStaff().getId(), new Date());
        customerRepository.save(customer);
    }
}
