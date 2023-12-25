package com.springboot.store.payload;

import lombok.*;

import java.util.List;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ListBonusAndPunishForStaffDTO {
    int staffId;
    List<ListBonusForStaffDTO> listBonus;
    List<ListPunishForStaffDTO> listPunish;
}
