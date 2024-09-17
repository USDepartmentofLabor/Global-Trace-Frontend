declare namespace Transport {
  import { TrashContentEnum } from 'enums/app';

  export type RequestParams = {
    productIds?: string[];
    fabricIds?: string[];
    toFacilityId: string;
    totalWeight: number;
    weightUnit: string;
    packingListNumber: string;
    transactedAt: number;
    uploadPackingLists: File[] | App.Any;
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
    weightUnit?: string;
    certifications?: string[];
    quantity?: number;
    quantityUnit?: string;
  };

  export type PartnerTransporter = {
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
}
