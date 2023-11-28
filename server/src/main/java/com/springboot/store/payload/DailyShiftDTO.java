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
public class DailyShiftDTO {
    private int id;
    private int shiftId;
    private String shiftName;
    private Date date;
    private String note;

    private List<ShiftAttendanceRecordDTO> attendanceList;
}
