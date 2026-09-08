package com.meditrack.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class CheckoutRequest {
    private String patientName;
    private BigDecimal totalAmount;
    private List<CheckoutItemDto> items;
}
