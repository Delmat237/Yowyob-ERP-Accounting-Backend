// DTO pour les écritures comptables
package com.yowyob.erp.accounting.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EcritureComptableDto {

    private Long id;

    private String numeroEcriture;

    @NotBlank(message = "Le libellé est obligatoire")
    private String libelle;

    @NotNull(message = "La date d'écriture est obligatoire")
    private LocalDate dateEcriture;

    @NotNull(message = "Le journal comptable est obligatoire")
    private Long journalComptableId;

    private String journalComptableLibelle;

    @NotNull(message = "La période comptable est obligatoire")
    private Long periodeComptableId;

    private String periodeComptableCode;

    @NotNull(message = "Le montant total est obligatoire")
    private Double montantTotal;

    private Boolean validee;

    private LocalDateTime dateValidation;

    private String utilisateurValidation;

    private String referenceExterne;

    private String notes;

    private List<DetailEcritureDto> detailsEcriture;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}