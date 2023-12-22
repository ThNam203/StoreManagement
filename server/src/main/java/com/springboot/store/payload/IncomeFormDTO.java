package com.springboot.store.payload;

import lombok.*;

import java.util.Date;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncomeFormDTO {
    private int id;
    private String payerType;
    private Date date;
    private String incomeType;
    private int value;
    private String creatorName;
    private int idPayer;
    private String payerName;
    private String note;
    private String description;
    private int linkedFormId;
}
