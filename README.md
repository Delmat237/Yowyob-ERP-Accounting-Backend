# YOWYOB ERP - Backend

YOWYOB ERP est un système ERP multi-tenant conforme aux normes OHADA, développé avec Spring Boot. Il prend en charge les opérations CRUD pour les tenants, intègre Apache Kafka pour la gestion des événements, Redis pour le caching, Elasticsearch pour la recherche, et ScyllaDB pour une persistance des données à haute performance. Conçu pour une scalabilité, une isolation robuste des données par tenant, et une conformité comptable OHADA.

## Table des matières
- [YOWYOB ERP - Backend](#yowyob-erp---backend)
  - [Table des matières](#table-des-matières)
  - [Fonctionnalités](#fonctionnalités)
  - [Architecture](#architecture)
  - [Prérequis](#prérequis)
  - [Installation](#installation)
  - [Technologies](#technologies)
  - [Configuration](#configuration)
  - [Exécution de l'application](#exécution-de-lapplication)
  - [Documentation API](#documentation-api)
  - [Tests](#tests)
    - [Tests unitaires et d'intégration](#tests-unitaires-et-dintégration)
    - [Dépendances de test](#dépendances-de-test)
  - [Notifications en temps réel](#notifications-en-temps-réel)
  - [Contribuer](#contribuer)
  - [Licence](#licence)

## Fonctionnalités
- **Multi-tenant** : Isolation des données par tenant avec `TenantContext` et `TenantInterceptor`.
- **Comptabilité OHADA** : Gestion des transactions comptables à double entrée avec un plan comptable standardisé.
- **Entités Complètes** : 11 entités principales (`Tenant`, `PlanComptable`, `JournalComptable`, `OperationComptable`, `Contrepartie`, `DeclarationFiscale`, `DetailEcriture`, `EcritureComptable`, `JournalAudit`, `PeriodeComptable`, `Transaction`).
- **Gestion des utilisateurs** : Authentification JWT avec rôles (`ADMIN`, `ACCOUNTANT`, `USER`, `AUDITOR`).
- **Cache** : Redis pour les sessions utilisateur, tokens JWT, et soldes de comptes.
- **Événements asynchrones** : Kafka pour les événements (`accounting.entries`, `invoice.events`, `notifications`, `audit.logs`).
- **Recherche avancée** : Elasticsearch pour l'indexation des écritures comptables et la recherche full-text.
- **API REST** : Plus de 25 endpoints avec validation JSR-303, pagination, et documentation Swagger.
- **Audit et traçabilité** : Journalisation complète des actions avec `JournalAudit`.
- **Performance** : Optimisation avec ScyllaDB pour une persistance à haute performance et Redis pour le caching.

## Architecture
Le backend suit une architecture multi-tenant optimisée pour la scalabilité :
- **Framework** : Spring Boot 3.x avec Java 17.
- **Persistance** : Spring Data Cassandra avec ScyllaDB pour une gestion performante des entités.
- **Authentification** : JWT via une API externe avec validation des tokens et caching Redis.
- **Événements** : Apache Kafka pour la communication asynchrone (ex. : création d'écritures comptables).
- **Cache** : Redis pour des accès rapides aux données fréquentes.
- **Recherche** : Elasticsearch pour des recherches full-text performantes.
- **API** : Endpoints REST documentés avec Swagger/OpenAPI.
- **Audit** : Interface `Auditable` pour standardiser les champs d’audit (`tenant_id`, `created_at`, `updated_at`, `created_by`, `updated_by`).

Structure du projet :
```
src/main/java/com/yowyob/erp
├── accounting
│   ├── controller
│   │   ├── EcritureComptableController.java
│   │   ├── OperationComptableController.java
│   │   ├── PlanComptableController.java
│   ├── dto
│   │   ├── BalanceDto.java
│   │   ├── ContrepartieDto.java
│   │   ├── DeclarationFiscaleDto.java
│   │   ├── DetailEcritureDto.java
│   │   ├── EcritureComptableDto.java
│   │   ├── GrandLivreDto.java
│   │   ├── JournalComptableDto.java
│   │   ├── OperationComptableDto.java
│   │   ├── PeriodeComptableDto.java
│   │   ├── PlanComptableDto.java
│   │   ├── TransactionDto.java
│   ├── entity
│   │   ├── Contrepartie.java
│   │   ├── DeclarationFiscale.java
│   │   ├── DetailEcriture.java
│   │   ├── EcritureComptable.java
│   │   ├── JournalAudit.java
│   │   ├── JournalComptable.java
│   │   ├── OperationComptable.java
│   │   ├── PeriodeComptable.java
│   │   ├── PlanComptable.java
│   │   ├── Tenant.java
│   │   ├── Transaction.java
│   ├── listener
│   │   ├── AccountingKafkaListener.java
│   ├── repository
│   │   ├── ContrepartieRepository.java
│   │   ├── DeclarationFiscaleRepository.java
│   │   ├── DetailEcritureRepository.java
│   │   ├── EcritureComptableRepository.java
│   │   ├── JournalAuditRepository.java
│   │   ├── JournalComptableRepository.java
│   │   ├── OperationComptableRepository.java
│   │   ├── PeriodeComptableRepository.java
│   │   ├── PlanComptableRepository.java
│   │   ├── TransactionRepository.java
│   ├── service
│   │   ├── PlanComptableService.java
│   │   ├── SynchronizationService.java
├── common
│   ├── constants
│   │   ├── AppConstants.java
│   ├── controller
│   │   ├── DebugController.java
│   │   ├── HealthController.java
│   ├── dto
│   │   ├── ApiResponse.java
│   │   ├── KafkaMessage.java
│   │   ├── SearchResult.java
│   ├── entity
│   │   ├── Auditable.java
│   ├── exception
│   │   ├── BusinessException.java
│   │   ├── GlobalExceptionHandler.java
│   │   ├── ResourceNotFoundException.java
│   │   ├── TenantException.java
│   ├── repository
│   │   ├── BaseRepository.java
│   ├── service
│   │   ├── ValidationService.java
│   ├── util
│   │   ├── ValidationUtils.java
├── config
│   ├── async
│   │   ├── AsyncConfig.java
│   ├── auth
│   │   ├── AuthService.java
│   │   ├── AuthValidationResponse.java
│   │   ├── JwtAuthenticationFilter.java
│   │   ├── SecurityConfig.java
│   │   ├── UserInfo.java
│   │   ├── WebClientConfig.java
│   ├── elasticsearch
│   │   ├── ElasticsearchConfig.java
│   │   ├── ElasticsearchService.java
│   │   ├── NoElasticsearchConfig.java
│   ├── jpa
│   │   ├── JpaConfig.java
│   ├── kafka
│   │   ├── KafkaConfig.java
│   │   ├── KafkaMessageService.java
│   ├── profile
│   │   ├── NoKafkaConfiguration.java
│   ├── redis
│   │   ├── RedisConfig.java
│   │   ├── RedisService.java
│   ├── swagger
│   │   ├── OpenApiConfig.java
│   ├── tenant
│   │   ├── TenantContext.java
│   │   ├── TenantInterceptor.java
│   │   ├── TenantWebConfig.java
├── SwaggerConfig.java
├── YowyobErpBackendApplication.java
```

## Prérequis
- **Java** : JDK 17 ou supérieur
- **Maven** : 3.8.x ou supérieur
- **ScyllaDB** : 5.4 ou supérieur
- **Redis** : 6 ou supérieur
- **Kafka** : Confluent Platform 7.5.x ou supérieur
- **Elasticsearch** : 8.x ou supérieur
- **Docker** : Pour exécuter les services d’infrastructure et les tests avec Testcontainers

## Installation

1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/yowyob/yowyob-erp.git
   cd yowyob-erp
   ```

2. **Installer les dépendances** :
   ```bash
   mvn clean install
   ```

3. **Configurer ScyllaDB** :
   - Lancer ScyllaDB via Docker :
     ```bash
     docker run -d --name scylla -p 9042:9042 scylladb/scylla:5.4
     ```
   - Exécuter le fichier de schéma CQL :
     ```bash
     docker exec -i scylla cqlsh < src/main/resources/init.cql
     ```

4. **Configurer Kafka, Redis, et Elasticsearch** :
   - Lancer les services via Docker Compose :
     ```bash
     docker-compose -f docker-compose.yml up -d
     ```

## Technologies
- **Framework** : Spring Boot 3.x
- **Base de données** : ScyllaDB 5.4 (Spring Data Cassandra)
- **Messaging** : Apache Kafka (confluentinc/cp-kafka:7.5.0)
- **Caching** : Redis 6.x
- **Recherche** : Elasticsearch 8.x
- **Sécurité** : JWT via une API externe
- **Documentation** : Swagger (springdoc-openapi)
- **Validation** : JSR-303 (Jakarta Validation)
- **Tests** : JUnit 5, Testcontainers

## Configuration
Mettre à jour le fichier `src/main/resources/application.properties` avec les paramètres de votre environnement :

```properties
# ScyllaDB
spring.cassandra.contact-points=localhost
spring.cassandra.port=9042
spring.cassandra.keyspace-name=yowyob_erp
spring.cassandra.username=cassandra
spring.cassandra.password=cassandra
spring.cassandra.local-datacenter=datacenter1

# Kafka
spring.kafka.bootstrap-servers=localhost:9092
spring.kafka.consumer.group-id=yowyob-erp-group
spring.kafka.producer.key-serializer=org.apache.kafka.common.serialization.StringSerializer
spring.kafka.producer.value-serializer=org.springframework.kafka.support.serializer.JsonSerializer
spring.kafka.consumer.key-deserializer=org.apache.kafka.common.serialization.StringDeserializer
spring.kafka.consumer.value-deserializer=org.springframework.kafka.support.serializer.JsonDeserializer
spring.kafka.consumer.properties.spring.json.trusted.packages=com.yowyob.erp

# Redis
spring.redis.host=localhost
spring.redis.port=6379
spring.redis.password=secret

# Elasticsearch
spring.elasticsearch.uris=http://localhost:9200

# JWT
yowyob.auth.jwt.validation-url=http://auth-service/validate
yowyob.auth.jwt.cache-ttl=3600

# Swagger
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui
springdoc.swagger-ui.operations-sorter=alpha
springdoc.swagger-ui.tags-sorter=alpha
springdoc.info.title=YOWYOB ERP Backend API
springdoc.info.description=API pour la gestion multi-tenant des opérations comptables OHADA
springdoc.info.version=1.0.0
```

## Exécution de l'application
1. **Lancer l'infrastructure** :
   ```bash
   docker-compose up -d
   ```

2. **Lancer l'application** :
   ```bash
   mvn spring-boot:run
   ```

3. **Accéder aux interfaces** :
   - API : `http://localhost:8081`
   - Swagger : `http://localhost:8081/swagger-ui`
   - Kafka UI : `http://localhost:8080`
   - ScyllaDB (CQLSH) : `docker exec -it scylla cqlsh`

## Documentation API
- Accéder à l'interface Swagger à `http://localhost:8081/swagger-ui` pour une documentation détaillée.
- Endpoints principaux :
  - `/api/comptable/plan` : Gestion du plan comptable.
  - `/api/comptable/journal` : Gestion des journaux comptables.
  - `/api/comptable/operation` : Paramétrage des opérations comptables.
  - `/api/comptable/ecriture` : Gestion des écritures comptables.
  - `/api/comptable/declaration` : Gestion des déclarations fiscales.
  - `/api/comptable/transaction` : Enregistrement des transactions.

## Tests

### Tests unitaires et d'intégration
- Le projet utilise JUnit 5 et Testcontainers pour tester avec ScyllaDB, Kafka, Redis, et Elasticsearch.
- Exécuter les tests :
  ```bash
  mvn test
  ```
- Classes de test principales :
  - `PlanComptableServiceTest` : Teste la création et la récupération des comptes.
  - `EcritureComptableServiceTest` : Teste la validation des écritures comptables.
  - `DeclarationFiscaleServiceTest` : Teste la gestion des déclarations fiscales.

### Dépendances de test
Assurez-vous que les dépendances suivantes sont dans votre `pom.xml` :

```xml
<dependencies>
    <dependency>
        <groupId>org.testcontainers</groupId>
        <artifactId>testcontainers</artifactId>
        <version>1.19.3</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.testcontainers</groupId>
        <artifactId>cassandra</artifactId>
        <version>1.19.3</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.testcontainers</groupId>
        <artifactId>kafka</artifactId>
        <version>1.19.3</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.testcontainers</groupId>
        <artifactId>elasticsearch</artifactId>
        <version>1.19.3</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.testcontainers</groupId>
        <artifactId>junit-jupiter</artifactId>
        <version>1.19.3</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

## Notifications en temps réel
- Les événements Kafka (ex. : `accounting.entries`, `audit.logs`) sont relayés via WebSocket pour les mises à jour en temps réel.
- Exemple de connexion client :
  ```javascript
  import SockJS from 'sockjs-client';
  import Stomp from 'stompjs';

  const socket = new SockJS('http://localhost:8081/ws');
  const stompClient = Stomp.over(socket);
  stompClient.connect({}, () => {
      stompClient.subscribe('/topic/notifications', (message) => {
          console.log('Notification:', message.body);
      });
  });
  ```

## Contribuer
1. Forker le dépôt.
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/votre-fonctionnalite`).
3. Commiter vos changements (`git commit -m "Ajout de votre fonctionnalité"`).
4. Pousser la branche (`git push origin feature/votre-fonctionnalite`).
5. Ouvrir une pull request avec une description claire des changements.

Respectez les [directives de style de code](https://google.github.io/styleguide/javaguide.html) et assurez-vous que les tests passent avant de soumettre.

## Licence
Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
