package com.meditrack.backend.dto;

import lombok.Data;

@Data
public class CheckoutItemDto {
    private Long medicineId;
    private Integer quantity;
}
