// DTO pour les détails d'écriture
package com.yowyob.erp.accounting.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DetailEcritureDto {

    private Long id;

    @NotNull(message = "L'ID de l'écriture comptable est obligatoire")
    private Long ecritureComptableId;

    @NotNull(message = "Le plan comptable est obligatoire")
    private Long planComptableId;

    private String planComptableNumero;

    private String planComptableLibelle;

    @NotBlank(message = "Le libellé est obligatoire")
    private String libelle;

    @NotBlank(message = "Le sens est obligatoire")
    private String sens;

    private Double montantDebit = 0.0;

    private Double montantCredit = 0.0;

    private String notes;
}