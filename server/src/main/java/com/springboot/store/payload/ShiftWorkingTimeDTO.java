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
public class ShiftWorkingTimeDTO {
    private int id;
    @JsonFormat(pattern = "HH:mm:ss")
    private Date startTime;
    @JsonFormat(pattern = "HH:mm:ss")
    private Date endTime;
}
