// Repository Période Comptable
package com.yowyob.erp.accounting.repository;

import com.yowyob.erp.accounting.entity.PeriodeComptable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PeriodeComptableRepository extends JpaRepository<PeriodeComptable, Long> {

    List<PeriodeComptable> findByTenantIdOrderByDateDebutDesc(String tenantId);

    Optional<PeriodeComptable> findByTenantIdAndCode(String tenantId, String code);

    @Query("SELECT p FROM PeriodeComptable p WHERE p.tenantId = :tenantId AND :date BETWEEN p.dateDebut AND p.dateFin")
    Optional<PeriodeComptable> findByTenantIdAndDateInRange(@Param("tenantId") String tenantId, 
                                                          @Param("date") LocalDate date);

    List<PeriodeComptable> findByTenantIdAndClotureeFalse(String tenantId);

    @Query("SELECT p FROM PeriodeComptable p WHERE p.tenantId = :tenantId AND p.dateDebut >= :startDate AND p.dateFin <= :endDate")
    List<PeriodeComptable> findByTenantIdAndPeriodRange(@Param("tenantId") String tenantId,
                                                       @Param("startDate") LocalDate startDate,
                                                       @Param("endDate") LocalDate endDate);
}