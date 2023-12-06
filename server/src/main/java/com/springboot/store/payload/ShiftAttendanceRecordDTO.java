package com.springboot.store.payload;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.util.Date;
import java.util.List;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShiftAttendanceRecordDTO {
    private int id;
    private int staffId;
    private String staffName;
    private boolean hasAttend;
    private Date date;
    private List<StaffBonusSalaryDTO> bonusSalaryList;
    private List<StaffPunishSalaryDTO> punishSalaryList;
    private String note;

}
