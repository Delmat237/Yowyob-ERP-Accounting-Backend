// Repository Détail Écriture
package com.yowyob.erp.accounting.repository;

import com.yowyob.erp.accounting.entity.DetailEcriture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DetailEcritureRepository extends JpaRepository<DetailEcriture, Long> {

    List<DetailEcriture> findByTenantIdAndEcritureComptable_Id(String tenantId, Long ecritureId);

    @Query("SELECT d FROM DetailEcriture d WHERE d.tenantId = :tenantId AND d.planComptable.noCompte = :noCompte")
    List<DetailEcriture> findByTenantIdAndAccountNumber(@Param("tenantId") String tenantId,
                                                       @Param("noCompte") String noCompte);

    @Query("SELECT d FROM DetailEcriture d JOIN d.ecritureComptable e WHERE e.tenantId = :tenantId AND e.dateEcriture BETWEEN :startDate AND :endDate")
    List<DetailEcriture> findByTenantIdAndDateRange(@Param("tenantId") String tenantId,
                                                   @Param("startDate") LocalDate startDate,
                                                                                                   @Param("endDate") LocalDate endDate);    
                                                }