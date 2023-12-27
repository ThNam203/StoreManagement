package com.springboot.store.payload;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecordOfProductSellDTO {
    private int productId;
    private String name;
    private int quantitySell = 0;
    private int quantityReturn = 0;
    private int totalSell = 0;
    private int totalReturn = 0;
    private int total = 0;
    private List<InvoiceInRecordOfProductSellDTO> listInvoice;
    private List<ReturnInRecordOfProductSellDTO> listReturn;
}
