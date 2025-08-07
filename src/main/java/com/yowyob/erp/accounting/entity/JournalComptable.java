// Journal comptable
package com.yowyob.erp.accounting.entity;

import com.yowyob.erp.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "journal_comptable")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JournalComptable extends BaseEntity {

    @Column(name = "code_journal", nullable = false)
    private String codeJournal;

    @Column(name = "libelle", nullable = false)
    private String libelle;

    @Column(name = "type_journal", nullable = false)
    private String typeJournal;

    @Column(name = "notes")
    private String notes;

    @Column(name = "actif", nullable = false)
    private Boolean actif = true;
}