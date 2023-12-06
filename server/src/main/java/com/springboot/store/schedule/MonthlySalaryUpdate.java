package com.springboot.store.schedule;

import com.springboot.store.entity.Staff;
import com.springboot.store.repository.StaffRepository;
import com.springboot.store.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@RequiredArgsConstructor
public class MonthlySalaryUpdate {
    private final StaffRepository staffRepository;
    private final StaffService staffService;

    @Scheduled(cron = "0 0 0 L * ? *")
    public void updateStaffSalaryAtEndOfMonth() {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());
        //check if today is the last day of month
        int lastDayOfMonth = calendar.getActualMaximum(Calendar.DAY_OF_MONTH);
        int currentDayOfMonth = calendar.get(Calendar.DAY_OF_MONTH);
        if (currentDayOfMonth == lastDayOfMonth) {
            List<Staff> allStaff = staffRepository.findAllStaffsWithRoleNotOwner();
            for (Staff staff : allStaff) {
                staffService.getStaffSalary(staff.getId());
            }
        }
    }
}
