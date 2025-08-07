// DTO pour les informations utilisateur
package com.yowyob.erp.config.auth;

import lombok.Data;

@Data
public class UserInfo {
    private String id;
    private String username;
    private String email;
    private String tenantId; // À echanger avec le prof 
    private String[] roles;
    private boolean active;
}