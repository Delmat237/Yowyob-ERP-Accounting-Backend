// Période comptable
package com.yowyob.erp.accounting.entity;

import com.yowyob.erp.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "periode_comptable")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PeriodeComptable extends BaseEntity {

    @Column(name = "code", nullable = false)
    private String code;

    @Column(name = "date_debut", nullable = false)
    private LocalDate dateDebut;

    @Column(name = "date_fin", nullable = false)
    private LocalDate dateFin;

    @Column(name = "cloturee", nullable = false)
    private Boolean cloturee = false;

    @Column(name = "date_cloture")
    private LocalDate dateCloture;

    @Column(name = "notes")
    private String notes;
}