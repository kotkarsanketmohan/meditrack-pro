package com.meditrack.backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String pharmacyName;
    private String email;
    private String password;
}
