package com.springboot.store.payload;

import lombok.*;

import java.util.List;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShiftDTO {
    private int id;
    private String name;
    private String status;
    private ShiftWorkingTimeDTO workingTime;
    private ShiftClickingTimeDTO clickingTime;
    private List<DailyShiftDTO> dailyShiftList;
}
