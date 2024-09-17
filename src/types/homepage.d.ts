declare namespace Homepage {
  import { SortType, TrashContentEnum } from 'enums/app';

  export type Panel = {
    name: string;
    routeName: string;
  };

  export type PurchaseRequestParams = {
    productIds: string[];
    fromFacilityId: string;
    price: number;
    currency: string;
    purchaseOrderNumber: string;
    transactedAt: number;
    uploadProofs: File[];
  };

  export type Lot = {
    id: string;
    cottonCertification?: string;
    quality?: string;
    grade?: string;
    totalWeight?: number;
    weightType?: string;
    moistureLevel?: number;
    trashContent?: TrashContentEnum;
    code?: string;
    description?: string;
    weightUnit?: string;
    certifications?: string[];
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    isTransformed?: boolean;
    isManualAdded?: boolean;
    dnaIdentifier?: string;
    verifiedPercentage?: string;
  };

  export type PartnersSeller = {
    id: string;
    name: string;
    type: number;
    address: string;
    district: string;
    province: string;
    country: string;
    traderName: string;
    oarId: string;
    businessRegisterNumber: string;
    users: PurchaseUser[];
  };

  export type PurchaseUser = {
    id: string;
    email: string;
    phoneNumber: number;
    firstName: string;
    lastName: string;
    status: number;
  };

  export interface LotFilterParams {
    createdAt: SortType;
    code: SortType;
  }

  export type OutPutProductLot = {
    id: string;
    totalWeight: number;
    weightUnit: string;
    productId: string;
    description: string;
    createdAt?: number;
  };

  export type OutputProductRequestParams = {
    productId: string;
    totalWeight: number;
    weightUnit: string;
    description: string;
  };

  export interface ProductLotFilterParams {
    createdAt: SortType;
    productId: SortType;
  }

  export type RecordByProductRequestParams = {
    totalWeight: number;
    unit: string;
    transactedAt: number;
    uploadProofs: File[];
  };

  export type SellRequestParams = {
    productIds: string[];
    fromFacilityId: string;
    price: number;
    currency: string;
    transactedAt: number;
    invoiceNumber: number;
    packingListNumber: number;
    uploadProofs: File[];
    uploadPackings: File[];
  };

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
}
