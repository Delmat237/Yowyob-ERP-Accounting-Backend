package com.yowyob.erp.accounting.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO pour les opérations comptables
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OperationComptableDto {

    private Long id;

    @NotBlank(message = "Le type d'opération est obligatoire")
    private String typeOperation;

    @NotBlank(message = "Le mode de règlement est obligatoire")
    private String modeReglement;

    @NotBlank(message = "Le compte principal est obligatoire")
    private String comptePrincipal;

    @NotNull(message = "Le statut du compte statique est obligatoire")
    private Boolean estCompteStatique;

    @NotBlank(message = "Le sens principal est obligatoire")
    private String sensPrincipal;

    @NotNull(message = "Le journal comptable est obligatoire")
    private Long journalComptableId;

    @NotBlank(message = "Le type de montant est obligatoire")
    private String typeMontant;

    private Double plafondClient;

    private String notes;

    private Boolean actif;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
