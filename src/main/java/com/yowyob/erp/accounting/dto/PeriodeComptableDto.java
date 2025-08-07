// DTO pour les périodes comptables
package com.yowyob.erp.accounting.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PeriodeComptableDto {

    private Long id;

    @NotBlank(message = "Le code est obligatoire")
    private String code;

    @NotNull(message = "La date de début est obligatoire")
    private LocalDate dateDebut;

    @NotNull(message = "La date de fin est obligatoire")
    private LocalDate dateFin;

    private Boolean cloturee = false;

    private LocalDate dateCloture;

    private String notes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
