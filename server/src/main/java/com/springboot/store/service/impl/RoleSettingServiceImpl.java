package com.springboot.store.service.impl;

import com.springboot.store.entity.RolePermission;
import com.springboot.store.entity.RoleSetting;
import com.springboot.store.exception.CustomException;
import com.springboot.store.payload.RoleSettingDTO;
import com.springboot.store.repository.RoleSettingRepository;
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
}
