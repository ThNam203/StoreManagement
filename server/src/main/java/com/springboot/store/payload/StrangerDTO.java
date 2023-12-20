package com.springboot.store.payload;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StrangerDTO {
    private int id;
    private String name;
    private String address;
    private String phoneNumber;
    private String note;
}
