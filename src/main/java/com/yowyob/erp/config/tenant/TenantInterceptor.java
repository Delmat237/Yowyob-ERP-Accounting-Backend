package com.yowyob.erp.config.tenant;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import java.util.UUID;

// Intercepteur pour extraire le tenantId des requêtes
@Component
@RequiredArgsConstructor
@Slf4j
public class TenantInterceptor implements HandlerInterceptor {

    @Value("${app.tenant.header-name:X-Tenant-ID}")
    private String tenantHeaderName;
    
    @Value("${app.tenant.default-tenant:default}")
    private String defaultTenant;

    @Override
    public boolean preHandle(@NonNull HttpServletRequest request, 
                           @NonNull HttpServletResponse response, 
                           @NonNull Object handler) {
        UUID tenantId = extractTenantId(request);
        TenantContext.setCurrentTenant(tenantId);
        log.debug("Tenant défini: {}", tenantId);
        return true;
    }

    @Override
    public void afterCompletion(@NonNull HttpServletRequest request, 
                              @NonNull HttpServletResponse response, 
                              @NonNull Object handler, Exception ex) {
        TenantContext.clear();
    }

    private UUID extractTenantId(HttpServletRequest request) {
        // Extraction depuis le header
        String tenantIdStr = request.getHeader(tenantHeaderName);

        if (tenantIdStr == null || tenantIdStr.trim().isEmpty()) {
            // Extraction depuis JWT token (si disponible)
            tenantIdStr = extractFromJWT(request);
        }

        if (tenantIdStr == null || tenantIdStr.trim().isEmpty()) {
            // Extraction depuis les paramètres de requête
            tenantIdStr = request.getParameter("tenantId");
        }

        String finalTenantId = tenantIdStr != null && !tenantIdStr.trim().isEmpty() ? tenantIdStr.trim() : defaultTenant;
        try {
            return UUID.fromString(finalTenantId);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid tenantId format: {}. Using default tenantId.", finalTenantId);
            return UUID.fromString(defaultTenant);
        }
    }
    
    private String extractFromJWT(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // TODO: Décoder le JWT et extraire le tenantId
            // Pour l'instant, retourner null
            return null;
        }
        return null;
    }
}
