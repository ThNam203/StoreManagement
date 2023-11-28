package com.springboot.store.payload;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.util.Date;

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
    private Date timeIn;
    private Date timeOut;
    private String note;

}
