// Écriture comptable
package com.yowyob.erp.accounting.entity;

import com.yowyob.erp.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "ecriture_comptable")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EcritureComptable extends BaseEntity {

    @Column(name = "numero_ecriture", nullable = false, unique = true)
    private String numeroEcriture;

    @Column(name = "libelle", nullable = false)
    private String libelle;

    @Column(name = "date_ecriture", nullable = false)
    private LocalDate dateEcriture;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "journal_comptable_id", nullable = false)
    private JournalComptable journalComptable;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "periode_comptable_id", nullable = false)
    private PeriodeComptable periodeComptable;

    @Column(name = "montant_total", nullable = false)
    private Double montantTotal;

    @Column(name = "validee", nullable = false)
    private Boolean validee = false;

    @Column(name = "date_validation")
    private LocalDateTime dateValidation;

    @Column(name = "utilisateur_validation")
    private String utilisateurValidation;

    @Column(name = "reference_externe")
    private String referenceExterne;

    @Column(name = "notes")
    private String notes;

    @OneToMany(mappedBy = "ecritureComptable", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DetailEcriture> detailsEcriture;
}