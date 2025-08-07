# YOWYOB ERP - Backend

YOWYOB ERP est un Système ERP multi-tenant conforme aux normes OHADA, développé avec Spring Boot. Gère les opérations CRUD pour les tenants, intègre Kafka pour la gestion des événements (création, mise à jour, suppression), Redis pour le caching, et PostgreSQL pour la persistance des données. Conçu pour une scalabilité et une isolation robuste des données par tenant.

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
- **Multi-tenant** : Gestion des organisations (`Tenant`) avec isolation des données.
- **Comptabilité OHADA** : Transactions comptables à double entrée avec plan comptable standardisé.
- **Gestion des utilisateurs** : Gestion des utilisateurs (`User`) avec rôles (`Customer`, `BusinessActor`, `SuperAdmin`).
- **Gestion des agences et magasins** : Création et gestion des entités `Agency` et `Store` associées aux tenants.
- **Contrôle d'accès** : Intégration avec Keycloak pour une authentification sécurisée et RBAC.
- **Notifications en temps réel** : WebSocket avec STOMP pour des mises à jour en direct (ex. : création d'organisation).
- **Cache** : Utilisation de Redis pour des accès rapides aux données.
- **Événements asynchrones** : Kafka pour la gestion des événements comme la création d'organisations.
- **Clés API** : Gestion sécurisée des clés API pour les `BusinessActor`.

## Architecture
Le backend suit une architecture multi-tenant inspirée des microservices :
- **Framework** : Spring Boot avec Java 17.
- **Persistance** : Spring Data JPA avec PostgreSQL pour gérer les entités (`User`, `Tenant`, `Agency`, `Store`, `Account`, `AccountingEntry`).
- **Authentification** : Keycloak pour la gestion des utilisateurs et des rôles.
- **Événements** : Kafka pour la communication asynchrone (ex. : événements `OrganizationCreatedEvent`).
- **Cache** : Redis pour optimiser les performances.
- **Notifications** : Spring WebSocket avec STOMP pour les mises à jour en temps réel.
- **API** : Endpoints REST documentés avec Swagger/OpenAPI.

## Prérequis
- **Java** : JDK 17 ou supérieur
- **Maven** : 3.8.x ou supérieur
- **PostgreSQL** : 15 ou supérieur
- **Redis** : 6 ou supérieur
- **Kafka** : Confluent Platform 7.3.x ou supérieur
- **Docker** : Pour exécuter les tests basés sur Testcontainers

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

3. **Configurer PostgreSQL** :
   - Créer une base de données nommée `yowyob_erp`.
   - Exécuter le fichier de schéma SQL :
     ```bash
     psql -U postgres -d yowyob_erp -f src/main/resources/schema.sql
     ```
s rôles (`Customer`, `BusinessActor`, `SuperAdmin`) et les paramètres du client.

5. **Configurer Kafka et Redis PostgreSQL zt Elasticsearch** :
   - Lancer  via Docker Compose :
     ```bash
     docker-compose -f docker-compose.yml up -d
     ```
  
   
## Technologies
- **Framework** : Spring Boot 3.5.3
- **Base de données** : PostgreSQL
- **Messaging** : Kafka (confluentinc/cp-kafka:7.5.0)
- **Caching** : Redis
- **Sécurité** : JWT via une API externe
- **Documentation** : Swagger (springdoc-openapi)

## Configuration
Mettre à jour le fichier `src/main/resources/application.properties` avec les paramètres de votre environnement :

```properties
# Base de données
spring.datasource.url=jdbc:postgresql://localhost:5432/yowyob_erp
spring.datasource.username=postgres
spring.datasource.password=secret

# Kafka
spring.kafka.bootstrap-servers=localhost:9092

# Redis
spring.redis.host=localhost
spring.redis.port=6379

# Keycloak
spring.security.oauth2.client.provider.keycloak.issuer-uri=http://localhost:8080/realms/yowyob-erp
spring.security.oauth2.client.registration.keycloak.client-id=yowyob-erp-client
spring.security.oauth2.client.registration.keycloak.authorization-grant-type=authorization_code
spring.security.oauth2.client.registration.keycloak.scope=openid,profile,email

# Swagger
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui
springdoc.swagger-ui.operations-sorter=alpha
springdoc.swagger-ui.tags-sorter=alpha
springdoc.info.title=YOWYOB ERP Backend API
springdoc.info.description=API pour la gestion des tenants, utilisateurs, agences, magasins et transactions comptables
springdoc.info.version=1.0.0
```

## Exécution de l'application
1. Lancer l'application Spring Boot :
   ```bash
   mvn spring-boot:run
   ```
2. Le backend sera accessible à `http://localhost:8080`.

## Documentation API
- Accéder à l'interface Swagger à `http://localhost:8080/swagger-ui` pour une documentation API détaillée.
- Endpoints principaux :
  - `/api/business/agencies` : Gestion des agences.
  - `/api/business/stores` : Gestion des magasins.
  - `/api/business/accounting/tenants/{tenantId}/transactions` : Enregistrement des transactions comptables OHADA.
  - `/api/business/profile` : Mise à jour des profils des `BusinessActor`.

## Tests

### Tests unitaires et d'intégration
- Le projet utilise JUnit 5 et Testcontainers pour les tests d'intégration avec PostgreSQL et Kafka.
- Exécuter les tests :
  ```bash
  mvn test
  ```
- Classes de test principales :
  - `AgencyServiceIntegrationTest` : Teste la création et la récupération des agences.
  - `StoreServiceIntegrationTest` : Teste la gestion des magasins.
- Testcontainers lance automatiquement des conteneurs PostgreSQL et Kafka pour les tests.

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
        <artifactId>postgresql</artifactId>
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
        <artifactId>junit-jupiter</artifactId>
        <version>1.19.3</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

## Notifications en temps réel
- Le backend utilise Spring WebSocket avec STOMP pour les notifications en temps réel.
- Les événements (ex. : création d'une organisation) sont publiés sur Kafka et relayés aux clients via WebSocket.
- Exemple de connexion client :
  ```javascript
  import SockJS from 'sockjs-client';
  import Stomp from 'stompjs';

  const socket = new SockJS('http://localhost:8080/ws');
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

Veuillez respecter les [directives de style de code](https://google.github.io/styleguide/javaguide.html) et vous assurer que les tests passent avant de soumettre.

## Licence
Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
