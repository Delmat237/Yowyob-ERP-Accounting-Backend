// Journal d'audit
package com.yowyob.erp.accounting.entity;

import com.yowyob.erp.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "journal_audit")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JournalAudit extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ecriture_comptable_id")
    private EcritureComptable ecritureComptable;

    @Column(name = "action", nullable = false)
    private String action; // CREATION, VALIDATION, MODIFICATION

    @Column(name = "date_action", nullable = false)
    private LocalDateTime dateAction;

    @Column(name = "utilisateur", nullable = false)
    private String utilisateur;

    @Column(name = "details", columnDefinition = "TEXT")
    private String details;

    @Column(name = "adresse_ip")
    private String adresseIP;

    @Column(name = "donnees_avant", columnDefinition = "TEXT")
    private String donneesAvant;

    @Column(name = "donnees_apres", columnDefinition = "TEXT")
    private String donneesApres;
}
