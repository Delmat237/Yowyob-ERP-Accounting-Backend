// Repository Transaction
package com.yowyob.erp.accounting.repository;

import com.yowyob.erp.accounting.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByTenantIdOrderByDateTransactionDesc(String tenantId);

    Page<Transaction> findByTenantIdOrderByDateTransactionDesc(String tenantId, Pageable pageable);

    Optional<Transaction> findByTenantIdAndNumeroRecu(String tenantId, String numeroRecu);

    List<Transaction> findByTenantIdAndEstComptabiliseeFalse(String tenantId);

    List<Transaction> findByTenantIdAndEstValideeFalse(String tenantId);

    @Query("SELECT t FROM Transaction t WHERE t.tenantId = :tenantId AND t.dateTransaction BETWEEN :startDate AND :endDate")
    List<Transaction> findByTenantIdAndDateRange(@Param("tenantId") String tenantId,
                                               @Param("startDate") LocalDateTime startDate,
                                               @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(t.montantTransaction) FROM Transaction t WHERE t.tenantId = :tenantId AND t.estValidee = true")
    Double getTotalValidatedTransactions(@Param("tenantId") String tenantId);

    @Query("SELECT t FROM Transaction t WHERE t.tenantId = :tenantId AND t.caissier = :caissier")
    List<Transaction> findByTenantIdAndCaissier(@Param("tenantId") String tenantId,
                                              @Param("caissier") String caissier);

    boolean existsByTenantIdAndNumeroRecu(String tenantId, String numeroRecu);
}
