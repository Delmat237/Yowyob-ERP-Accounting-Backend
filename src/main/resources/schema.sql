CREATE TABLE IF NOT EXISTS tenants (
                                       id UUID PRIMARY KEY,
                                       name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL
    );

CREATE TABLE IF NOT EXISTS users (
                                     id UUID PRIMARY KEY,
                                     email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    tenant_id UUID,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    );

CREATE TABLE IF NOT EXISTS agencies (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    tenant_id UUID,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    );

CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    agency_id UUID,
    tenant_id UUID NOT NULL,
    FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE SET NULL,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
    );

CREATE TABLE accounts (
                          id UUID PRIMARY KEY,
                          account_number VARCHAR(50) NOT NULL,
                          name VARCHAR(255) NOT NULL,
                          tenant_id UUID NOT NULL,
                          balance DOUBLE PRECISION DEFAULT 0.0,
                          FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE TABLE accounting_entries (
                                    id UUID PRIMARY KEY,
                                    account_id UUID NOT NULL,
                                    tenant_id UUID NOT NULL,
                                    debit DOUBLE PRECISION NOT NULL,
                                    credit DOUBLE PRECISION NOT NULL,
                                    description TEXT,
                                    date TIMESTAMP NOT NULL,
                                    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
                                    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);