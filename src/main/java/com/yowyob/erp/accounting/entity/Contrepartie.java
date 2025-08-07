// Contreparties des opérations comptables
package com.yowyob.erp.accounting.entity;

import com.yowyob.erp.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "contrepartie")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Contrepartie extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operation_comptable_id", nullable = false)
    private OperationComptable operationComptable;

    @Column(name = "compte", nullable = false)
    private String compte;

    @Column(name = "est_compte_tiers", nullable = false)
    private Boolean estCompteTiers = false;

    @Column(name = "sens", nullable = false)
    private String sens; // DEBIT ou CREDIT

    @Column(name = "type_montant", nullable = false)
    private String typeMontant; // HT, TTC, TVA, PAU

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "journal_comptable_id", nullable = false)
    private JournalComptable journalComptable;

    @Column(name = "notes")
    private String notes;
}