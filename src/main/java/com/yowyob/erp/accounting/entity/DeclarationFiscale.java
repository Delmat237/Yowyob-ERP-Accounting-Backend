// Déclaration fiscale
package com.yowyob.erp.accounting.entity;

import com.yowyob.erp.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "declaration_fiscale")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DeclarationFiscale extends BaseEntity {

    @Column(name = "type_declaration", nullable = false)
    private String typeDeclaration; // TVA, IS, etc.

    @Column(name = "periode_debut", nullable = false)
    private LocalDate periodeDebut;

    @Column(name = "periode_fin", nullable = false)
    private LocalDate periodeFin;

    @Column(name = "montant_total", nullable = false)
    private Double montantTotal;

    @Column(name = "date_generation", nullable = false)
    private LocalDate dateGeneration;

    @Column(name = "statut", nullable = false)
    private String statut; // DRAFT, SUBMITTED, VALIDATED

    @Column(name = "numero_declaration")
    private String numeroDeclaration;

    @Column(name = "donnees_declaration", columnDefinition = "TEXT")
    private String donneesDeclaration;

    @Column(name = "notes")
    private String notes;
}