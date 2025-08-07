// Repository de base générique avec support multi-tenant
package com.yowyob.erp.common.repository;

import com.yowyob.erp.common.entity.BaseEntity;
import com.yowyob.erp.config.tenant.TenantContext;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.List;
import java.util.Optional;

@NoRepositoryBean
public interface BaseRepository<T extends BaseEntity, ID> extends JpaRepository<T, ID> {

    List<T> findByTenantId(String tenantId);

    default List<T> findAllByCurrentTenant() {
        return findByTenantId(TenantContext.getCurrentTenant());
    }

    default Optional<T> findByIdAndCurrentTenant(ID id) {
        return findByIdAndTenantId(id, TenantContext.getCurrentTenant());
    }

    Optional<T> findByIdAndTenantId(ID id, String tenantId);
}