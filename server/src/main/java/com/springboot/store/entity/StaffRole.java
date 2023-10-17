package com.springboot.store.entity;


import com.springboot.store.utils.Role;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "staff_role" , uniqueConstraints = {
        @UniqueConstraint(name = "staff_role_name_unique", columnNames = {"name"})
})
public class StaffRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Enumerated(EnumType.STRING)
    @Column(name = "name", nullable = false)
    private Role name;

    @Column(name = "description")
    private String description;

    @Column(name = "permission")
    private String permission;

    @ManyToOne
    @JoinColumn(name = "creator", referencedColumnName = "id")
    private Staff creator;

    @OneToMany(mappedBy = "staffRole", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Staff> staffs;

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + this.name));
    }
}
