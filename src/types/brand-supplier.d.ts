declare namespace BrandSupplier {
  import { SupplierStatusEnum, FacilityTypeEnum } from 'enums/user';
  import { LevelRiskCategoryEnum } from 'enums/saq';

  export interface SupplierItem {
    id: string;
    label: string;
    icon: string;
    logo?: string;
    name: string;
    targets?: string[] | Target[];
    status?: SupplierStatusEnum;
    canAdd?: boolean;
    canEdit?: boolean;
    disabled?: boolean;
    isRoot?: boolean;
    isTier?: boolean;
    orderSupplierId?: string;
    supplierId?: string;
    selfAssessment?: SelfAssessment;
    users?: Auth.User[];
    type?: FacilityTypeEnum;
    document?: Document;
    riskData?: Auth.RiskData;
    x?: number;
    y?: number;
    childrensTotal?: number;
    parents?: SupplierItem[];
    childrens?: SupplierItem[];
    overallRiskLevel?: LevelRiskCategoryEnum;
  }

  export type SupplierRequestParams = {
    facilityId?: string;
    email: string;
    firstName: string;
    lastName: string;
    name?: string;
    typeId: string;
    businessRegisterNumber?: string;
    oarId?: string;
    businessPartnerIds: string[];
  };

  export type BusinessPartnerRequest = {
    roleId?: string;
    key?: string;
  };

  export type SupplierPartnerRequestParams = {
    key: string;
  };

  export type SelfAssessment = {
    countryLaborRiskScore: number;
    provinceLaborRiskScore: number;
    districtLaborRiskScore: number;
    riskAssessmentScore: number;
    totalDraftAnswers?: number;
    completedSaqAt: number;
    riskScores?: RiskScore[];
  };

  export type PartnerFacility = {
    id: string;
    type: number;
    partnerId?: string;
  };

  export type Partner = {
    id: string;
    type: number;
    name: string;
    oarId: string;
    businessRegisterNumber: string;
  };

  export type BusinessPartners = {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
    riskAssessment: string;
    phone?: string;
    address?: string;
    certification?: string;
  };

  export type TransactionInfo = {
    purchaseOrderNumber: string;
    purchasedAt: number;
    invoiceNumber: string;
    packingListNumber: string;
  };

  export interface OrderSupplier {
    supplier: Auth.Facility;
    orderSupplierId: string;
    category: OrderCategoryEnum;
    transactionInfo?: TransactionInfo;
    isRoot: boolean;
    parentId: string;
    transactedAt: number;
    transactionIds: string[];
    tracedPurchasedAtLevel: number;
    tracedPurchasedAt: number;
    transactionId?: string;
    document?: Document;
  }

  export interface Document {
    hasInvoice: boolean;
    hasPackingList: boolean;
    hasProof: boolean;
    transactionIds: string[];
  }

  export interface SupplierMapGroup {
    type: string;
    suppliers: SupplierNode[];
  }

  export type NodeContentParams = {
    icon: string;
    label: string;
    name: string;
    logo: string;
  };

  export interface TraceProductData {
    name: string;
    logo: string;
    mappingSuppliers: TraceSupplierMapGroup[];
  }

  export type TraceSupplierMapGroup = {
    id: string;
    isRoot: boolean;
    isTier: boolean;
    label: string;
    icon: string;
    logo?: string;
    name: string;
    orderSupplierId: string;
    targets: Target[];
    type: RoleAndPermission.Role;
    x?: number;
    y?: number;
    parents?: TraceSupplierMapGroup[];
    childrens?: TraceSupplierMapGroup[];
    overallRiskLevel?: LevelRiskCategoryEnum;
  };

  export interface SupplierNode {
    id: string;
    name: string;
    label: string;
    icon: string;
    logo?: string;
    riskLevel: PDFPreview.RiskLevel;
    selfAssessment: SelfAssessment;
    targets: string[];
    type: string;
    users: Auth.User[];
    x?: number;
    y?: number;
    isRoot?: boolean;
    childrensTotal?: number;
    parents?: SupplierItem[];
    childrens?: SupplierItem[];
  }

  export type Line = {
    fromNodeId: string;
    toNodeId: string;
    hasBrokerIcon: boolean;
  };

  export type Target = {
    hasBrokerIcon: boolean;
    targetId: string;
  };
}
