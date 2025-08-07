package com.yowyob.erp.config.tenant;

import org.springframework.stereotype.Component;

/**
 * Contexte tenant pour isoler les données par tenant
 * Utilise ThreadLocal pour maintenir le tenantId par thread
 */
@Component
public class TenantContext {
    
    private static final ThreadLocal<String> currentTenant = new ThreadLocal<>();
    
    public static void setCurrentTenant(String tenantId) {
        currentTenant.set(tenantId);
    }
    
    public static String getCurrentTenant() {
        return currentTenant.get();
    }
    
    public static void clear() {
        currentTenant.remove();
    }
}
