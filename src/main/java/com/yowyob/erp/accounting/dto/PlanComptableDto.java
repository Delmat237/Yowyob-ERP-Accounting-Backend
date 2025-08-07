// DTO pour le plan comptable
package com.yowyob.erp.accounting.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanComptableDto {

    private Long id;

    @NotBlank(message = "Le numéro de compte est obligatoire")
    @Pattern(regexp = "^[1-8][0-9]{4,7}$", message = "Format de numéro de compte OHADA invalide")
    private String noCompte;

    @NotBlank(message = "Le libellé est obligatoire")
    private String libelle;

    private String notes;

    private Boolean actif = true;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}