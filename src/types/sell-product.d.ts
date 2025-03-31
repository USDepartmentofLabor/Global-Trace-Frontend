declare namespace SellProduct {
  export type RequestParams = {
    productIds: string[];
    toFacilityId: string;
    price?: number;
    currency?: string;
    transactedAt: number;
    invoiceNumber: number;
    packingListNumber: number;
    uploadInvoices: File[] | App.Any;
    uploadPackingLists: File[] | App.Any;
  };

  export type PartnerPurchaser = {
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

  export interface ProductFilterParams {
    createdAt: SortType;
    code: SortType;
  }

  export type FilterParams = {
    code?: string;
    createdAt?: string;
  };
}
