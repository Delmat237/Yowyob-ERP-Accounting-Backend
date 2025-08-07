// Détail d'écriture comptable
package com.yowyob.erp.accounting.entity;

import com.yowyob.erp.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "detail_ecriture")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetailEcriture extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ecriture_comptable_id", nullable = false)
    private EcritureComptable ecritureComptable;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_comptable_id", nullable = false)
    private PlanComptable planComptable;

    @Column(name = "libelle", nullable = false)
    private String libelle;

    @Column(name = "sens", nullable = false)
    private String sens; // DEBIT ou CREDIT

    @Column(name = "montant_debit")
    private Double montantDebit = 0.0;

    @Column(name = "montant_credit")
    private Double montantCredit = 0.0;

    @Column(name = "notes")
    private String notes;
}