// Configuration des opérations comptables
package com.yowyob.erp.accounting.entity;

import com.yowyob.erp.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "operation_comptable")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OperationComptable extends BaseEntity {

    @Column(name = "type_operation", nullable = false)
    private String typeOperation; // SALE, PURCHASE, etc.

    @Column(name = "mode_reglement", nullable = false)
    private String modeReglement; // CASH, CREDIT, etc.

    @Column(name = "compte_principal", nullable = false)
    private String comptePrincipal;

    @Column(name = "est_compte_statique", nullable = false)
    private Boolean estCompteStatique = false;

    @Column(name = "sens_principal", nullable = false)
    private String sensPrincipal; // DEBIT ou CREDIT

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "journal_comptable_id", nullable = false)
    private JournalComptable journalComptable;

    @Column(name = "type_montant", nullable = false)
    private String typeMontant; // HT, TTC, TVA, PAU

    @Column(name = "plafond_client")
    private Double plafondClient;

    @Column(name = "actif", nullable = false)
    private Boolean actif = true;

    @Column(name = "notes")
    private String notes;

    @OneToMany(mappedBy = "operationComptable", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Contrepartie> contreparties;
}
