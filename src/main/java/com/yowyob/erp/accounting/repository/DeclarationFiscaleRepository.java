// Repository Déclaration Fiscale
package com.yowyob.erp.accounting.repository;

import com.yowyob.erp.accounting.entity.DeclarationFiscale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DeclarationFiscaleRepository extends JpaRepository<DeclarationFiscale, Long> {

    List<DeclarationFiscale> findByTenantIdOrderByDateGenerationDesc(String tenantId);

    List<DeclarationFiscale> findByTenantIdAndTypeDeclaration(String tenantId, String typeDeclaration);

    List<DeclarationFiscale> findByTenantIdAndStatut(String tenantId, String statut);

    Optional<DeclarationFiscale> findByTenantIdAndNumeroDeclaration(String tenantId, String numeroDeclaration);

    @Query("SELECT d FROM DeclarationFiscale d WHERE d.tenantId = :tenantId AND d.periodeDebut >= :startDate AND d.periodeFin <= :endDate")
    List<DeclarationFiscale> findByTenantIdAndPeriodRange(@Param("tenantId") String tenantId,
                                                         @Param("startDate") LocalDate startDate,
                                                         @Param("endDate") LocalDate endDate);

    boolean existsByTenantIdAndNumeroDeclaration(String tenantId, String numeroDeclaration);
}
