// Repository Opération Comptable
package com.yowyob.erp.accounting.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.yowyob.erp.accounting.entity.OperationComptable;

@Repository
public interface OperationComptableRepository extends JpaRepository<OperationComptable, Long> {

    List<OperationComptable> findByTenantIdAndActifTrue(String tenantId);

    Optional<OperationComptable> findByTenantIdAndTypeOperationAndModeReglement(
            String tenantId, String typeOperation, String modeReglement);

    List<OperationComptable> findByTenantIdAndTypeOperation(String tenantId, String typeOperation);

    List<OperationComptable> findByTenantIdAndModeReglement(String tenantId, String modeReglement);
}