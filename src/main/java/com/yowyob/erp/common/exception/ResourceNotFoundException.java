// Exception pour les ressources non trouvées
package com.yowyob.erp.common.exception;

public class ResourceNotFoundException extends RuntimeException {
    
    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resource, String id) {
        super(String.format("%s avec l'ID %s non trouvé", resource, id));
    }
}