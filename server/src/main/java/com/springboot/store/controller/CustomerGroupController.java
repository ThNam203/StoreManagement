package com.springboot.store.controller;

import com.springboot.store.payload.CustomerGroupDTO;
import com.springboot.store.service.CustomerGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer-groups")
@RequiredArgsConstructor
public class CustomerGroupController {
    private final CustomerGroupService customerGroupService;

    @GetMapping("/{customerGroupId}")
    public ResponseEntity<CustomerGroupDTO> getCustomerGroupById(@PathVariable int customerGroupId) {
        CustomerGroupDTO customerGroupDTO = customerGroupService.getCustomerGroupById(customerGroupId);
        return ResponseEntity.ok(customerGroupDTO);
    }

    @GetMapping
    public ResponseEntity<?> getAllCustomerGroups() {
        return ResponseEntity.ok(customerGroupService.getAllCustomerGroups());
    }

    @PostMapping
    public ResponseEntity<CustomerGroupDTO> createCustomerGroup(@RequestBody CustomerGroupDTO customerGroupDTO) {
        CustomerGroupDTO createdCustomerGroup = customerGroupService.createCustomerGroup(customerGroupDTO);
        return ResponseEntity.ok(createdCustomerGroup);
    }

    @PutMapping("/{customerGroupId}")
    public ResponseEntity<CustomerGroupDTO> updateCustomerGroup(@PathVariable int customerGroupId, @RequestBody CustomerGroupDTO customerGroupDTO) {
        CustomerGroupDTO updatedCustomerGroup = customerGroupService.updateCustomerGroup(customerGroupId, customerGroupDTO);
        return ResponseEntity.ok(updatedCustomerGroup);
    }

    @DeleteMapping("/{customerGroupId}")
    public ResponseEntity<Void> deleteCustomerGroup(@PathVariable int customerGroupId) {
        customerGroupService.deleteCustomerGroup(customerGroupId);
        return ResponseEntity.noContent().build();
    }

}
