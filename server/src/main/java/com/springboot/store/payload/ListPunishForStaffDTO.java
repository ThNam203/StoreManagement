package com.springboot.store.payload;

import lombok.*;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ListPunishForStaffDTO {
    String name;
    int multiply = 0;
    int value = 0;
}
