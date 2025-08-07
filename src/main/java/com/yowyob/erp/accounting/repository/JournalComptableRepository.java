// Repository Journal Comptable
package com.yowyob.erp.accounting.repository;

import com.yowyob.erp.accounting.entity.JournalComptable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JournalComptableRepository extends JpaRepository<JournalComptable, Long> {

    List<JournalComptable> findByTenantIdAndActifTrue(String tenantId);

    Optional<JournalComptable> findByTenantIdAndCodeJournal(String tenantId, String codeJournal);

    List<JournalComptable> findByTenantIdAndTypeJournal(String tenantId, String typeJournal);

    boolean existsByTenantIdAndCodeJournal(String tenantId, String codeJournal);
}