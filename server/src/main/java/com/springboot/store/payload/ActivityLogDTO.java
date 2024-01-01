package com.springboot.store.payload;

import lombok.*;

import java.util.Date;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLogDTO {
    private int id;
    private String description;
    private int staffId;
    private Date time;
}
