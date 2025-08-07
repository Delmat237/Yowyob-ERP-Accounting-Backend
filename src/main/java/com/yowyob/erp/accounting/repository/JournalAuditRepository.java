// Repository Journal d'Audit
package com.yowyob.erp.accounting.repository;

import com.yowyob.erp.accounting.entity.JournalAudit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface JournalAuditRepository extends JpaRepository<JournalAudit, Long> {

    Page<JournalAudit> findByTenantIdOrderByDateActionDesc(String tenantId, Pageable pageable);

    List<JournalAudit> findByTenantIdAndUtilisateur(String tenantId, String utilisateur);

    List<JournalAudit> findByTenantIdAndAction(String tenantId, String action);

    @Query("SELECT j FROM JournalAudit j WHERE j.tenantId = :tenantId AND j.dateAction BETWEEN :startDate AND :endDate")
    List<JournalAudit> findByTenantIdAndDateRange(@Param("tenantId") String tenantId,
                                                 @Param("startDate") LocalDateTime startDate,
                                                 @Param("endDate") LocalDateTime endDate);

    @Query("SELECT j FROM JournalAudit j WHERE j.tenantId = :tenantId AND j.ecritureComptable.id = :ecritureId")
    List<JournalAudit> findByTenantIdAndEcritureComptable(@Param("tenantId") String tenantId,
                                                         @Param("ecritureId") Long ecritureId);
}
