// Repository Écriture Comptable
package com.yowyob.erp.accounting.repository;

import com.yowyob.erp.accounting.entity.EcritureComptable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EcritureComptableRepository extends JpaRepository<EcritureComptable, Long> {

    List<EcritureComptable> findByTenantIdOrderByDateEcritureDesc(String tenantId);

    Page<EcritureComptable> findByTenantIdOrderByDateEcritureDesc(String tenantId, Pageable pageable);

    Optional<EcritureComptable> findByTenantIdAndNumeroEcriture(String tenantId, String numeroEcriture);

    List<EcritureComptable> findByTenantIdAndValideeFalse(String tenantId);

    @Query("SELECT e FROM EcritureComptable e WHERE e.tenantId = :tenantId AND e.dateEcriture BETWEEN :startDate AND :endDate")
    List<EcritureComptable> findByTenantIdAndDateRange(@Param("tenantId") String tenantId,
                                                      @Param("startDate") LocalDate startDate,
                                                      @Param("endDate") LocalDate endDate);

    @Query("SELECT e FROM EcritureComptable e WHERE e.tenantId = :tenantId AND e.journalComptable.id = :journalId")
    List<EcritureComptable> findByTenantIdAndJournalComptable(@Param("tenantId") String tenantId,
                                                             @Param("journalId") Long journalId);

    @Query("SELECT e FROM EcritureComptable e WHERE e.tenantId = :tenantId AND e.periodeComptable.id = :periodeId")
    List<EcritureComptable> findByTenantIdAndPeriodeComptable(@Param("tenantId") String tenantId,
                                                             @Param("periodeId") Long periodeId);

    @Query("SELECT COUNT(e) FROM EcritureComptable e WHERE e.tenantId = :tenantId AND e.validee = false")
    long countNonValidatedEntries(@Param("tenantId") String tenantId);

    boolean existsByTenantIdAndNumeroEcriture(String tenantId, String numeroEcriture);
}