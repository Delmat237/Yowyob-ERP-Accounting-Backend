package com.yowyob.erp.accounting.entity;

import com.yowyob.erp.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Plan comptable OHADA
 */
@Entity
@Table(name = "plan_comptable")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PlanComptable extends BaseEntity {

    @Column(name = "no_compte", nullable = false, unique = true)
    private String noCompte;

    @Column(name = "libelle", nullable = false)
    private String libelle;

    @Column(name = "notes")
    private String notes;

    @Column(name = "actif", nullable = false)
    private Boolean actif = true;
}