package com.springboot.store.payload;

import lombok.*;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ViolationAndRewardDTO {
    private int id;
    private String name;
    private String type;
    private int defaultValue;
}
