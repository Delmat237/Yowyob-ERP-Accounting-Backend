package com.yowyob.erp.accounting.repository;

import com.yowyob.erp.accounting.entity.PlanComptable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlanComptableRepository extends JpaRepository<PlanComptable, Long> {

    List<PlanComptable> findByTenantIdAndActifTrue(String tenantId);

    Optional<PlanComptable> findByTenantIdAndNoCompte(String tenantId, String noCompte);

    @Query("SELECT p FROM PlanComptable p WHERE p.tenantId = :tenantId AND p.noCompte LIKE :prefix%")
    List<PlanComptable> findByTenantIdAndNoCompteStartsWith(@Param("tenantId") String tenantId, 
                                                           @Param("prefix") String prefix);

    boolean existsByTenantIdAndNoCompte(String tenantId, String noCompte);
}