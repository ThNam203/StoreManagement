package com.springboot.store.service.impl;

import com.springboot.store.entity.RolePermission;
import com.springboot.store.entity.RoleSetting;
import com.springboot.store.entity.StaffPosition;
import com.springboot.store.exception.CustomException;
import com.springboot.store.payload.RoleSettingDTO;
import com.springboot.store.repository.RoleSettingRepository;
import com.springboot.store.repository.StaffPositionRepository;
import com.springboot.store.service.RoleSettingService;
import com.springboot.store.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleSettingServiceImpl implements RoleSettingService {
    private final RoleSettingRepository roleSettingRepository;
    private final StaffPositionRepository staffPositionRepository;
    private final ModelMapper modelMapper;
    private final StaffService staffService;

    @Override
    public RoleSettingDTO savePermission(int staffPositionId, RoleSettingDTO roleSetting) {
        RoleSetting roleSettingFromDB;
        roleSettingFromDB = roleSettingRepository.findByStaffPositionId(staffPositionId).orElseThrow(() -> new CustomException("Role setting not found", HttpStatus.NOT_FOUND));
        roleSettingFromDB.setOverview(modelMapper.map(roleSetting.getOverview(), RolePermission.class));
        roleSettingFromDB.setCatalog(modelMapper.map(roleSetting.getCatalog(), RolePermission.class));
        roleSettingFromDB.setDiscount(modelMapper.map(roleSetting.getDiscount(), RolePermission.class));
        roleSettingFromDB.setStockCheck(modelMapper.map(roleSetting.getStockCheck(), RolePermission.class));
        roleSettingFromDB.setInvoice(modelMapper.map(roleSetting.getInvoice(), RolePermission.class));
        roleSettingFromDB.setReturnInvoice(modelMapper.map(roleSetting.getReturnInvoice(), RolePermission.class));
        roleSettingFromDB.setPurchaseOrder(modelMapper.map(roleSetting.getPurchaseOrder(), RolePermission.class));
        roleSettingFromDB.setPurchaseReturn(modelMapper.map(roleSetting.getPurchaseReturn(), RolePermission.class));
        roleSettingFromDB.setDamageItems(modelMapper.map(roleSetting.getDamageItems(), RolePermission.class));
        roleSettingFromDB.setFundLedger(modelMapper.map(roleSetting.getFundLedger(), RolePermission.class));
        roleSettingFromDB.setCustomer(modelMapper.map(roleSetting.getCustomer(), RolePermission.class));
        roleSettingFromDB.setSupplier(modelMapper.map(roleSetting.getSupplier(), RolePermission.class));
        roleSettingFromDB.setReport(modelMapper.map(roleSetting.getReport(), RolePermission.class));
        roleSettingFromDB.setAttendance(modelMapper.map(roleSetting.getAttendance(), RolePermission.class));
        roleSettingFromDB.setStaff(modelMapper.map(roleSetting.getStaff(), RolePermission.class));
        roleSettingRepository.save(roleSettingFromDB);
        return modelMapper.map(roleSettingFromDB, RoleSettingDTO.class);
    }

    @Override
    public RoleSettingDTO getRoleSetting(int staffPositionId) {
        RoleSetting roleSetting = roleSettingRepository.findByStaffPositionId(staffPositionId).orElseThrow(() -> new CustomException("Role setting not found", HttpStatus.NOT_FOUND));
        return modelMapper.map(roleSetting, RoleSettingDTO.class);
    }

    @Override
    public List<RoleSettingDTO> getAllRoleSetting() {
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        List<RoleSetting> roleSettings = roleSettingRepository.findByStoreId(storeId);
        return roleSettings.stream().map(roleSetting -> modelMapper.map(roleSetting, RoleSettingDTO.class)).toList();
    }

    @Override
    public RoleSettingDTO createRoleSetting(RoleSettingDTO roleSettingDTO) {
        if (staffPositionRepository.existsByNameAndStore(roleSettingDTO.getStaffPositionName(), staffService.getAuthorizedStaff().getStore())) {
            throw new RuntimeException("Staff position already exists");
        }
        StaffPosition staffPosition = StaffPosition.builder()
                .name(roleSettingDTO.getStaffPositionName())
                .store(staffService.getAuthorizedStaff().getStore())
                .roleSetting(RoleSetting.builder()
                        .overview(modelMapper.map(roleSettingDTO.getOverview(), RolePermission.class))
                        .catalog(modelMapper.map(roleSettingDTO.getCatalog(), RolePermission.class))
                        .discount(modelMapper.map(roleSettingDTO.getDiscount(), RolePermission.class))
                        .stockCheck(modelMapper.map(roleSettingDTO.getStockCheck(), RolePermission.class))
                        .invoice(modelMapper.map(roleSettingDTO.getInvoice(), RolePermission.class))
                        .returnInvoice(modelMapper.map(roleSettingDTO.getReturnInvoice(), RolePermission.class))
                        .purchaseOrder(modelMapper.map(roleSettingDTO.getPurchaseOrder(), RolePermission.class))
                        .purchaseReturn(modelMapper.map(roleSettingDTO.getPurchaseReturn(), RolePermission.class))
                        .damageItems(modelMapper.map(roleSettingDTO.getDamageItems(), RolePermission.class))
                        .fundLedger(modelMapper.map(roleSettingDTO.getFundLedger(), RolePermission.class))
                        .customer(modelMapper.map(roleSettingDTO.getCustomer(), RolePermission.class))
                        .supplier(modelMapper.map(roleSettingDTO.getSupplier(), RolePermission.class))
                        .report(modelMapper.map(roleSettingDTO.getReport(), RolePermission.class))
                        .attendance(modelMapper.map(roleSettingDTO.getAttendance(), RolePermission.class))
                        .staff(modelMapper.map(roleSettingDTO.getStaff(), RolePermission.class))
                        .store(staffService.getAuthorizedStaff().getStore())
                        .build())
                .build();
        StaffPosition newStaffPosition = staffPositionRepository.save(staffPosition);
        RoleSetting roleSetting = newStaffPosition.getRoleSetting();
        RoleSettingDTO roleSettingDTOResponse = modelMapper.map(roleSetting, RoleSettingDTO.class);
        roleSettingDTOResponse.setStaffPositionId(newStaffPosition.getId());
        roleSettingDTOResponse.setStaffPositionName(newStaffPosition.getName());

        return roleSettingDTOResponse;
    }
}
