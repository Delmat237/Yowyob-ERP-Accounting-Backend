// Service Elasticsearch pour l'indexation
package com.yowyob.erp.config.elasticsearch;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.mapping.Property;
import co.elastic.clients.elasticsearch._types.mapping.TextProperty;
import co.elastic.clients.elasticsearch._types.mapping.KeywordProperty;
import co.elastic.clients.elasticsearch._types.mapping.DateProperty;
import co.elastic.clients.elasticsearch.core.*;
import co.elastic.clients.elasticsearch.core.search.Hit;
import co.elastic.clients.elasticsearch.indices.CreateIndexRequest;
import co.elastic.clients.elasticsearch.indices.ExistsRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ElasticsearchService {

    private final ElasticsearchClient client;

    /**
     * Crée un index s'il n'existe pas
     */
    public void createIndexIfNotExists(String indexName) {
        try {
            ExistsRequest existsRequest = ExistsRequest.of(e -> e.index(indexName));
            boolean exists = client.indices().exists(existsRequest).value();

            if (!exists) {
                CreateIndexRequest createRequest = CreateIndexRequest.of(c -> c
                        .index(indexName)
                        .mappings(m -> m
                                .properties("tenantId", Property.of(p -> p.keyword(KeywordProperty.of(k -> k))))
                                .properties("id", Property.of(p -> p.keyword(KeywordProperty.of(k -> k))))
                                .properties("createdAt", Property.of(p -> p.date(DateProperty.of(d -> d))))
                                .properties("updatedAt", Property.of(p -> p.date(DateProperty.of(d -> d))))
                                .properties("searchText", Property.of(p -> p.text(TextProperty.of(t -> t
                                        .analyzer("standard")
                                        .searchAnalyzer("standard")))))
                        )
                );

                client.indices().create(createRequest);
                log.info("Index créé: {}", indexName);
            }
        } catch (IOException e) {
            log.error("Erreur lors de la création de l'index: {}", indexName, e);
        }
    }

    /**
     * Indexe un document
     */
    public void indexDocument(String indexName, String documentId, Object document) {
        try {
            createIndexIfNotExists(indexName);

            IndexRequest<Object> request = IndexRequest.of(i -> i
                    .index(indexName)
                    .id(documentId)
                    .document(document)
            );

            IndexResponse response = client.index(request);
            log.debug("Document indexé: {} dans l'index: {}", documentId, indexName);
        } catch (IOException e) {
            log.error("Erreur lors de l'indexation du document: {} dans l'index: {}", documentId, indexName, e);
        }
    }

    /**
     * Recherche des documents
     */
    public <T> List<T> searchDocuments(String indexName, String query, Class<T> clazz, String tenantId) {
        try {
            SearchRequest searchRequest = SearchRequest.of(s -> s
                    .index(indexName)
                    .query(q -> q
                            .bool(b -> b
                                    .must(m -> m
                                            .multiMatch(mm -> mm
                                                    .query(query)
                                                    .fields("searchText", "libelle", "description")
                                            )
                                    )
                                    .filter(f -> f
                                            .term(t -> t
                                                    .field("tenantId")
                                                    .value(tenantId)
                                            )
                                    )
                            )
                    )
                    .size(100)
            );

            SearchResponse<T> response = client.search(searchRequest, clazz);
            
            return response.hits().hits().stream()
                    .map(Hit::source)
                    .collect(Collectors.toList());

        } catch (IOException e) {
            log.error("Erreur lors de la recherche dans l'index: {}", indexName, e);
            return List.of();
        }
    }

    /**
     * Met à jour un document
     */
    public void updateDocument(String indexName, String documentId, Object document) {
        try {
            UpdateRequest<Object, Object> request = UpdateRequest.of(u -> u
                    .index(indexName)
                    .id(documentId)
                    .doc(document)
            );

            client.update(request, Object.class);
            log.debug("Document mis à jour: {} dans l'index: {}", documentId, indexName);
        } catch (IOException e) {
            log.error("Erreur lors de la mise à jour du document: {} dans l'index: {}", documentId, indexName, e);
        }
    }

    /**
     * Supprime un document
     */
    public void deleteDocument(String indexName, String documentId) {
        try {
            DeleteRequest request = DeleteRequest.of(d -> d
                    .index(indexName)
                    .id(documentId)
            );

            client.delete(request);
            log.debug("Document supprimé: {} de l'index: {}", documentId, indexName);
        } catch (IOException e) {
            log.error("Erreur lors de la suppression du document: {} de l'index: {}", documentId, indexName, e);
        }
    }

    /**
     * Indexe les écritures comptables pour la recherche
     */
    public void indexAccountingEntry(Object entry, String tenantId) {
        String indexName = "accounting-entries-" + tenantId.toLowerCase();
        String documentId = extractId(entry);
        indexDocument(indexName, documentId, entry);
    }

    /**
     * Recherche des écritures comptables
     */
    public <T> List<T> searchAccountingEntries(String query, Class<T> clazz, String tenantId) {
        String indexName = "accounting-entries-" + tenantId.toLowerCase();
        return searchDocuments(indexName, query, clazz, tenantId);
    }

    /**
     * Indexe les clients/fournisseurs
     */
    public void indexThirdParty(Object thirdParty, String tenantId, String type) {
        String indexName = String.format("%s-%s", type.toLowerCase(), tenantId.toLowerCase());
        String documentId = extractId(thirdParty);
        indexDocument(indexName, documentId, thirdParty);
    }

    /**
     * Recherche des tiers (clients/fournisseurs)
     */
    public <T> List<T> searchThirdParties(String query, String type, Class<T> clazz, String tenantId) {
        String indexName = String.format("%s-%s", type.toLowerCase(), tenantId.toLowerCase());
        return searchDocuments(indexName, query, clazz, tenantId);
    }

    private String extractId(Object obj) {
        try {
            // Utilise la réflexion pour extraire l'ID
            java.lang.reflect.Field idField = obj.getClass().getDeclaredField("id");
            idField.setAccessible(true);
            Object id = idField.get(obj);
            return id != null ? id.toString() : java.util.UUID.randomUUID().toString();
        } catch (Exception e) {
            log.warn("Impossible d'extraire l'ID de l'objet, génération d'un UUID", e);
            return java.util.UUID.randomUUID().toString();
        }
    }
}
