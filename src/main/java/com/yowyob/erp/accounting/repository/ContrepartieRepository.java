// Repository Contrepartie
package com.yowyob.erp.accounting.repository;

import com.yowyob.erp.accounting.entity.Contrepartie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContrepartieRepository extends JpaRepository<Contrepartie, Long> {

    List<Contrepartie> findByTenantIdAndOperationComptable_Id(String tenantId, Long operationId);

    List<Contrepartie> findByTenantIdAndCompte(String tenantId, String compte);
}