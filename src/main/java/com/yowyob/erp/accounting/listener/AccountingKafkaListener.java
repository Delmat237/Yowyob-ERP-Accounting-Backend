// Listener Kafka pour traiter les événements
package com.yowyob.erp.accounting.listener;

import com.yowyob.erp.common.dto.KafkaMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AccountingKafkaListener {

    /**
     * Écoute les événements de facturation pour génération automatique d'écritures
     */
    @KafkaListener(topics = "invoice.events", groupId = "${spring.kafka.consumer.group-id}")
    public void handleInvoiceEvents(@Payload KafkaMessage message,
                                   @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
                                   @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
                                   Acknowledgment acknowledgment) {
        try {
            log.info("Réception d'un événement de facture: {} pour le tenant: {}", 
                    message.getEventType(), message.getTenantId());

            // Traitement selon le type
            switch (message.getEventType()) {
                case "INVOICE_CREATED":
                    // Logique pour gérer la création de facture
                    log.info("Traitement de la création de facture pour le tenant: {}", message.getTenantId());
                    break;
                case "INVOICE_UPDATED":
                    // Logique pour gérer la mise à jour de facture
                    log.info("Traitement de la mise à jour de facture pour le tenant: {}", message.getTenantId());
                    break;
                case "INVOICE_DELETED":
                    // Logique pour gérer la suppression de facture
                    log.info("Traitement de la suppression de facture pour le tenant: {}", message.getTenantId());
                    break;
                default:
                    log.warn("Événement inconnu reçu: {}", message.getEventType());
            }
            // Accusé de réception du message*      
            acknowledgment.acknowledge();
        } catch (Exception e) {
            log.error("Erreur lors du traitement de l'événement de facture: {}", e.getMessage(), e);
            // Gestion des erreurs, éventuellement réessayer ou enregistrer dans un système de journalisation
        }
        }   
    }