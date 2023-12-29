package com.springboot.store.payload;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RolePermissionDTO {
    private boolean create;
    private boolean read;
    private boolean update;
    private boolean delete;
    private Boolean export;
}
