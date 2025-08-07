-- init.sql
CREATE DATABASE IF NOT EXISTS yowyob_erp;

-- Création des extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Création des tables principales (PostgreSQL)
-- Cette structure sera générée automatiquement par Hibernate
-- mais voici un exemple de la structure attendue

-- Table Plan Comptable
CREATE TABLE IF NOT EXISTS plan_comptable (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    no_compte VARCHAR(20) NOT NULL,
    libelle VARCHAR(255) NOT NULL,
    notes TEXT,
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    UNIQUE(tenant_id, no_compte)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_plan_comptable_tenant ON plan_comptable(tenant_id);
CREATE INDEX IF NOT EXISTS idx_plan_comptable_no_compte ON plan_comptable(no_compte);

-- Table Journal Comptable
CREATE TABLE IF NOT EXISTS journal_comptable (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    code_journal VARCHAR(20) NOT NULL,
    libelle VARCHAR(255) NOT NULL,
    type_journal VARCHAR(50) NOT NULL,
    notes TEXT,
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    UNIQUE(tenant_id, code_journal)
);

CREATE INDEX IF NOT EXISTS idx_journal_comptable_tenant ON journal_comptable(tenant_id);
CREATE INDEX IF NOT EXISTS idx_journal_comptable_type ON journal_comptable(type_journal);

-- Insertion des données de base OHADA
INSERT INTO plan_comptable (tenant_id, no_compte, libelle, notes) VALUES
('default', '57000', 'Caisse Centrale', 'Compte de caisse principal'),
('default', '41100', 'Clients', 'Comptes clients'),
('default', '40100', 'Fournisseurs', 'Comptes fournisseurs'),
('default', '70100', 'Ventes de marchandises', 'Compte de ventes'),
('default', '60300', 'Achats de marchandises', 'Compte d''achats'),
('default', '31000', 'Stock de marchandises', 'Stock'),
('default', '44300', 'TVA collectée', 'TVA sur les ventes'),
('default', '44500', 'TVA déductible', 'TVA sur les achats')
ON CONFLICT (tenant_id, no_compte) DO NOTHING;

INSERT INTO journal_comptable (tenant_id, code_journal, libelle, type_journal) VALUES
('default', 'VTE', 'Journal des Ventes', 'SALES'),
('default', 'ACH', 'Journal des Achats', 'PURCHASES'),
('default', 'CAI', 'Journal de Caisse', 'CASH'),
('default', 'BAN', 'Journal de Banque', 'BANK'),
('default', 'OD', 'Opérations Diverses', 'GENERAL')
ON CONFLICT (tenant_id, code_journal) DO NOTHING;
