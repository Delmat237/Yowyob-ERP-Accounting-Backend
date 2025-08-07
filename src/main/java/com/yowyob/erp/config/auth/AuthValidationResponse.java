package com.yowyob.erp.config.auth;

import lombok.Builder;
import lombok.Data;

// DTO pour la réponse de validation

@Data
@Builder
public class AuthValidationResponse {
    private boolean valid;
    private String userId;
    private String tenantId;
    private String[] roles;
    
    public static AuthValidationResponse invalid() {
        return AuthValidationResponse.builder()
                .valid(false)
                .build();
    }
}