declare namespace PDFPreview {
  import { SeverityEnum } from 'enums/auditor';

  export type ProductRisk = {
    id: string;
    name: string;
  };

  export interface ChartData {
    chartInfo: string;
    data: Data[];
  }

  export type Data = {
    value: number;
    name?: string;
  };

  export type VerifiedCottonData = {
    verifiedWeight: number;
    notVerifiedWeight: number;
  };

  export type SpinnerAuditingData = {
    auditedSpinnerCount: number;
    notAuditedSpinnerCount: number;
  };

  export type CottonOriginData = {
    fromLocation: string;
    isFromPakistan: boolean;
  };

  export interface Assessment {
    order: BrandProduct.Order;
    cottonOriginChart: CottonOriginData[];
    spinnerAuditingChart: SpinnerAuditingData;
    verifiedCottonChart: VerifiedCottonData;
    countByRiskLevel: AssessmentRiskLevel[];
    topFiveIssues: TopFiveIssue[];
  }

  export type TopFiveIssue = {
    risk: Auth.Risk;
    indicator: Indicator;
    indicator: SubIndicator;
  };

  export type Indicator = {
    category: Auth.Category;
    name: string;
  };

  export type SubIndicator = {
    name: string;
  };

  export interface SupplierMapping {
    traceResultList: BrandSupplier.OrderSupplier[];
    orderSuppliers: BrandSupplier.SupplierItem[];
    traceMappingSuppliers: BrandSupplier.SupplierItem[];
  }

  export interface PDFData {
    homePage: Auth.Facility;
    overallRiskScore: OverallRiskScore;
    assessment: Assessment;
    supplierMapping: SupplierMapping;
    tracingObjects: TracingObject[];
    language: string;
  }

  export type RiskLevel = {
    laborRiskLevel: string;
    laborRiskScore: number;
    productRiskLevel: string;
    productRiskScore: number;
    overallRiskLevel: string;
    overallRiskScore: number;
  };

  export type TierRiskLevel = {
    averageLaborRiskScore: number;
    laborRiskLevel: SeverityEnum;
  };

  export interface OverallRiskScore {
    averageOverallRiskScore: number;
    overallRiskLevel: SeverityEnum;
    tierRiskLevels: TierRiskLevel[];
  }

  export interface OverallRiskData {
    label: string;
    items: RiskItem[];
  }

  export type RiskItem = {
    disable: boolean;
    level: SeverityEnum | null;
  };

  export type RiskKey = {
    name: string;
    label: string;
  };

  export interface Response {
    pdfData: PDFData;
  }

  export type TracingObject = {
    supplier: Auth.Facility;
    transactions: Transaction[];
  };

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
    fromFacilityType?: RoleAndPermission.Role;
    transactionItems?: TransactionItem[];
    notLoggedTransactions: NotLoggedTransaction[];
    type?: number;
  }

  export interface TransactionItem {
    id: string;
    createdAt: number;
    updatedAt: number;
    transactionId: string;
    entityId: string;
    entityType: string;
    product: Purchase.Product;
  }

  export interface NotLoggedTransaction {
    productType: string;
    toFacility: Auth.Facility;
    products: Purchase.Product[];
    transactedAt: number;
  }

  export type Product = {
    id: string;
    cottonCertification?: string;
    grade?: string;
    totalWeight?: number;
    weightType?: string;
    moistureLevel?: number;
    trashContent?: TrashContentEnum;
    code?: string;
    description?: string;
    totalWeight?: number;
    weightUnit?: number;
    certifications?: string[];
  };

  export type IssueIdentified = {
    type: string;
    content: string;
  };

  export type AssessmentRiskLevel = {
    count: number;
    riskLevel: string;
  };
}
