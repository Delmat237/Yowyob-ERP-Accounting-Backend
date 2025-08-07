// Transaction
package com.yowyob.erp.accounting.entity;

import com.yowyob.erp.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "transaction")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Transaction extends BaseEntity {

    @Column(name = "numero_recu", unique = true)
    private String numeroRecu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operation_comptable_id")
    private OperationComptable operationComptable;

    @Column(name = "montant_transaction", nullable = false)
    private Double montantTransaction;

    @Column(name = "montant_lettre")
    private String montantLettre;

    @Column(name = "est_montant_ttc", nullable = false)
    private Boolean estMontantTTC = true;

    @Column(name = "date_transaction", nullable = false)
    private LocalDateTime dateTransaction;

    @Column(name = "est_validee", nullable = false)
    private Boolean estValidee = false;

    @Column(name = "date_validation")
    private LocalDateTime dateValidation;

    @Column(name = "reference_objet")
    private String referenceObjet;

    @Column(name = "caissier")
    private String caissier;

    @Column(name = "est_comptabilisee", nullable = false)
    private Boolean estComptabilisee = false;

    @Column(name = "notes")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ecriture_comptable_id")
    private EcritureComptable ecritureComptable;
}