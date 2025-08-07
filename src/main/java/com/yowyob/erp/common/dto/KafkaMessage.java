package com.yowyob.erp.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Message générique pour Kafka
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KafkaMessage {
    private Object payload;
    private String tenantId;
    private String eventType;
    private LocalDateTime timestamp;
    private String correlationId;
    private String source;
}
