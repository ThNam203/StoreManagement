package com.springboot.store.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "role_permission")
public class RolePermission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "create_permission", nullable = false)
    private boolean create;
    @Column(name = "read_permission", nullable = false)
    private boolean read;
    @Column(name = "update_permission", nullable = false)
    private boolean update;
    @Column(name = "delete_permission", nullable = false)
    private boolean delete;
    @Column(name = "export_permission" )
    private Boolean export;
}
