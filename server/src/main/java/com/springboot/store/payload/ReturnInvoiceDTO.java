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
public class ReturnInvoiceDTO {
    private int id;
    private int total;
    private int returnFee;
    private String note;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createdAt;
    private Integer staffId;
    private Integer invoiceId;
    private Integer customerId;
    private List<ReturnDetailDTO> returnDetails;
}
