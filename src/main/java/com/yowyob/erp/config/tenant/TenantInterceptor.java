package com.yowyob.erp.config.tenant;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

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
        String tenantId = extractTenantId(request);
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

    private String extractTenantId(HttpServletRequest request) {
        // Extraction depuis le header
        String tenantId = request.getHeader(tenantHeaderName);
        
        if (tenantId == null || tenantId.trim().isEmpty()) {
            // Extraction depuis JWT token (si disponible)
            tenantId = extractFromJWT(request);
        }
        
        if (tenantId == null || tenantId.trim().isEmpty()) {
            // Extraction depuis les paramètres de requête
            tenantId = request.getParameter("tenantId");
        }
        
        return tenantId != null ? tenantId.trim() : defaultTenant;
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
