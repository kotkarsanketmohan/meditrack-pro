package com.meditrack.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDto {
    private String pharmacyName;
    private String email;
    private String mobileNo;
    private String address;
    private String licenseNumber;
}
