declare namespace TransactionHistory {
  export type RequestParams = {
    page?: number;
    perPage?: number;
    to?: number;
    from?: number;
  };

  export type StatisticRequestParams = {
    to?: number;
    from?: number;
  };

  export type MassBalanceResponse = {
    verifiedQuantity: number;
    notVerifiedQuantity: number;
    lastUpdatedAt: number;
    canCalculate: boolean;
    quantityUnit: string;
  };

  export type MassBalancePercent = {
    verifiedPercent: number;
    notVerifiedPercent: number;
  };

  export type MassBalanceWeight = {
    verifiedWeight: number;
    notVerifiedWeight: number;
  };

  export type TotalTransactionResponse = {
    totalInputs: TransactionResponse;
    totalOutputs: TransactionResponse;
    totalByProduct: TransactionResponse;
  };

  export type TransactionResponse = {
    canCalculate?: boolean;
    value?: number;
    marginOfError?: number;
  };

  export type TotalTransaction = {
    name: string;
    total: number;
    totalColor: string;
    unit: string;
    icon?: string;
    hasLoading: boolean;
    errorMessage?: string;
    show: boolean;
  };

  export type MassBalance = {
    verifiedPercent: number;
    notVerifiedPercent: number;
    verifiedWeight: number;
    notVerifiedWeight: number;
    total: number;
    updatedAt: string;
    quantityUnit: string;
    canCalculate: boolean;
  };

  export interface Statistic {
    totalTransactions: TotalTransaction[];
    massBalance: MassBalance;
  }

  export interface TransactionItem {
    id: string;
    createdAt: number;
    updatedAt: number;
    transactionId: string;
    entityId: string;
    entityType: string;
    product: Purchase.Product;
    isVerified: boolean;
  }

  export interface Transaction {
    totalWeight: number;
    id: string;
    createdAt: number;
    updatedAt: number;
    fromFacilityId: string;
    toFacilityId: string;
    price: number;
    currency: string;
    weightUnit: string;
    isVerified: boolean;
    purchaseOrderNumber: string;
    invoiceNumber: number;
    packingListNumber: number;
    transactedAt: number;
    uploadProofs: string[];
    uploadInvoices: string[];
    uploadPackingLists: string[];
    creatorId: string;
    deletedAt: string;
    toFacility?: Auth.Facility;
    fromFacility?: Auth.Facility;
    transactionItems?: TransactionItem[];
    type?: TransactionTypeEnum;
  }

  export interface History {
    totalWeight: number;
    id: string;
    createdAt: number;
    updatedAt: number;
    entityId: string;
    entityType: string;
    recordedAt: number;
    transaction?: Transaction;
    transformation?: Transformation;
    recordProduct?: RecordProduct;
    type: TransactionTypeEnum;
    isVerified?: boolean;
  }

  export type SeasonStartTime = {
    seasonStartTime: number;
    seasonDuration: number;
  };

  export interface RecordProduct {
    createdAt: number;
    updatedAt: number;
    facilityId: string;
    id: string;
    recordedAt: number;
    totalWeight: number;
    weightUnit: string;
  }

  export interface Transformation {
    id: string;
    createdAt: number;
    updatedAt: number;
    creatorId: string;
    deletedAt: number;
    dnaIdentifier: string;
    facilityId: string;
    transformationItems: TransactionItem[];
  }
}
