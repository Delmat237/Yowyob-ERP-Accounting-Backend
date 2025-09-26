export interface Account {
  id: UUID; // Unique identifier for the account 
  classe?:number;
  noCompte: string; // Account code (e.g., 101100, 411xxxx)
  libelle: string; // Account name (e.g., "Capital social", "Vente à un client au comptant")
  type: string; // Account type (e.g., "Capitaux propres", "Comptes de tiers")
  notes: string; // Additional notes or description
  actif: boolean; // Indicates if the account is active
  allowEntry: boolean; // Indicates if the account allows entries (e.g., checkbox in the interface)
  view: string; // View type (e.g., "Vue" for visibility in the interface)
  isStatic: boolean; // Indicates if the account is static or dynamic (e.g., 57xxxx vs 411xxxx)
  debitAccount?: string; // Optional debit account code for operations
  creditAccount?: string; // Optional credit account code for operations
  journalType: string; // Journal type (e.g., "Journal des ventes", "Journal des opérations")
  amountType: string; // Type of amount (e.g., "Montant Toutes Taxes Comprises (TTC)")
  operationType?: string; // Optional operation type (e.g., "Vente", "Achat")
  modeReglement?: string; // Payment mode (e.g., "Espèces", "Crédit")
  createdAt?: Date; // Optional creation date
  updatedAt?: Date; // Optional last update date
}


export interface OperationComptable {
  id?: UUID;
  typeOperation: string;
  modeReglement: string;
  comptePrincipal: string;
  estCompteStatique: boolean;
  sensPrincipal: string;
  journalComptableId: UUID;
  typeMontant: string;
  plafondClient?: number;
  actif: boolean;
  notes?: string;
  counterpartyDetails?: CounterpartyDetail[];
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface DetailEcritureDto {
  id?: UUID;
  compteId: UUID;
  libelle: string;
  montantDebit: number;
  montantCredit: number;
  notes?: string;
}

export interface EcritureComptable {
  id?: UUID;
  numeroEcriture?: string;
  libelle: string;
  dateEcriture: Date;
  journalComptableId: UUID;
  journalComptableLibelle?: string;
  periodeComptableId: UUID;
  periodeComptableCode?: string;
  montantTotalDebit: number;
  montantTotalCredit: number;
  validee?: boolean;
  dateValidation?: Date;
  utilisateurValidation?: string;
  referenceExterne?: string;
  notes?: string;
  detailsEcriture?: DetailEcritureDto[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface JournalComptable {
  id?:UUID;
  codeJournal :string;
  libelle :string;
  typeJournal :string;
  notes?:string;
  actif:boolean;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
ecritureComptable?: EcritureComptable[];

}


 export interface PeriodeComptable {
  id?: UUID;
  code?: string; // Format YYYY-MM
  dateDebut?: Date;
  dateFin?: Date;
  cloturee?: boolean;
  dateCloture?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}


export interface CounterpartyDetail {
  id?: UUID;
  account: string; // Account code
  isTiers: boolean; // Client or Supplier account
  amountType: 'TTC' | 'HT' | 'TVA';
  journalType: 'VENTES' | 'ACHATS' | 'DIVERS' | 'TRESORERIE';
  debitOrCredit: 'DEBIT' | 'CREDIT';
}

export interface LedgerSettings {
  id?: UUID;
  accountRangeStart: string;
  accountRangeEnd: string;
  reportFormat: 'PDF' | 'EXCEL' | 'CSV';
  includeDetails: boolean;
}

export interface GeneralSettings {
  id?: UUID;
  defaultCurrency: string;
  defaultFiscalYear: string; // Format YYYY

  entryMode?: 'AUTOMATIC' |'SEMI_AUTOMATIC' | 'MANUAL';
}
export type UUID = string; 