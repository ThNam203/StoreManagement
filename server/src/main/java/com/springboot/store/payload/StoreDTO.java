package com.springboot.store.payload;

import lombok.*;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoreDTO {
    private int id;
    private String name;
    private String address;
    private String phoneNumber;
    private String email;
    private String description;
    private int OwnerID;
}
