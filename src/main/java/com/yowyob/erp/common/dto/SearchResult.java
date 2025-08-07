// DTO pour la recherche Elasticsearch
package com.yowyob.erp.common.dto;

import java.time.LocalDateTime;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResult {
    private String id;
    private String tenantId;
    private String type;
    private String title;
    private String description;
    private Map<String, Object> data;
    private LocalDateTime createdAt;
    private Double score;
}
