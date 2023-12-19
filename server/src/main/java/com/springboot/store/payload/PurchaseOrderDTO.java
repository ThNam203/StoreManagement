package com.springboot.store.payload;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PurchaseOrderDTO {
    private int id;
    private int subtotal;
    private int discount;
    private int total;
    private String note;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createdDate;
    private List<PurchaseOrderDetailDTO> purchaseOrderDetail;
    private Integer staffId;
    private Integer supplierId;
}
