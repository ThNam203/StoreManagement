package com.springboot.store.payload;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.springboot.store.entity.Staff;
import com.springboot.store.entity.StockCheckDetail;
import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;
import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class StockCheckDTO {
    private int id;
    private Date createdDate;
    private Integer creatorId;
    private List<StockCheckDetailDTO> products;
    private String note;
}
