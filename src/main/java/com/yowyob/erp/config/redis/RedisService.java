// Service Redis pour le cache des sessions et données
package com.yowyob.erp.config.redis;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class RedisService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    /**
     * Sauvegarde une valeur avec TTL
     */
    public void save(String key, Object value, Duration ttl) {
        try {
            redisTemplate.opsForValue().set(key, value, ttl.toSeconds(), TimeUnit.SECONDS);
            log.debug("Valeur sauvegardée en cache: {}", key);
        } catch (Exception e) {
            log.error("Erreur lors de la sauvegarde en cache pour la clé: {}", key, e);
        }
    }

    /**
     * Récupère une valeur
     */
    public <T> T get(String key, Class<T> type) {
        try {
            Object value = redisTemplate.opsForValue().get(key);
            if (value == null) {
                return null;
            }
            
            if (type.isInstance(value)) {
                return type.cast(value);
            }
            
            // Conversion JSON si nécessaire
            String json = objectMapper.writeValueAsString(value);
            return objectMapper.readValue(json, type);
        } catch (JsonProcessingException e) {
            log.error("Erreur lors de la récupération du cache pour la clé: {}", key, e);
            return null;
        }
    }

    /**
     * Supprime une valeur
     */
    public void delete(String key) {
        try {
            redisTemplate.delete(key);
            log.debug("Clé supprimée du cache: {}", key);
        } catch (Exception e) {
            log.error("Erreur lors de la suppression du cache pour la clé: {}", key, e);
        }
    }

    /**
     * Vérifie l'existence d'une clé
     */
    public boolean exists(String key) {
        try {
            return Boolean.TRUE.equals(redisTemplate.hasKey(key));
        } catch (Exception e) {
            log.error("Erreur lors de la vérification d'existence pour la clé: {}", key, e);
            return false;
        }
    }

    /**
     * Sauvegarde des soldes de comptes
     */
    public void saveAccountBalance(String tenantId, String accountNumber, Double balance) {
        String key = String.format("balance:%s:%s", tenantId, accountNumber);
        save(key, balance, Duration.ofMinutes(30));
    }

    /**
     * Récupère le solde d'un compte
     */
    public Double getAccountBalance(String tenantId, String accountNumber) {
        String key = String.format("balance:%s:%s", tenantId, accountNumber);
        return get(key, Double.class);
    }

    /**
     * Sauvegarde les informations de session utilisateur
     */
    public void saveUserSession(String sessionId, Object userInfo, Duration ttl) {
        String key = "session:" + sessionId;
        save(key, userInfo, ttl);
    }

    /**
     * Récupère les informations de session
     */
    public <T> T getUserSession(String sessionId, Class<T> type) {
        String key = "session:" + sessionId;
        return get(key, type);
    }
}