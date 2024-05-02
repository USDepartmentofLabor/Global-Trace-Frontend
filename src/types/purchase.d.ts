declare namespace Purchase {
  import('enums/product');
  import('enums/app');

  import { SortType, TrashContentEnum } from 'enums/app';

  export type PurchaseRequestParams = {
    productIds?: string[];
    fromFacilityId?: string;
    price?: number;
    currency?: string;
    purchaseOrderNumber: string;
    transactedAt: number;
    uploadProofs: File[] | string[] | App.Any;
    manualAddedData?: ManualAddedData;
  };

  export type PartnerSellerParam = {
    key?: string;
  };

  export type Product = {
    id: string;
    lotId?: string;
    cottonCertification?: string;
    quality?: string;
    grade?: string;
    totalWeight?: number;
    weightType?: string;
    dnaIdentifier?: string;
    moistureLevel?: number;
    trashContent?: TrashContentEnum;
    code?: string;
    description?: string;
    weightUnit?: string;
    certifications?: string[];
    price?: number;
    currency?: string;
    uploadProofs: File[];
    isHavingCertification?: boolean;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    countryId?: string;
    provinceId?: string;
    districtId?: string;
    isManually?: boolean;
    isSold?: boolean;
    isManualAdded?: boolean;
    isPurchased?: boolean;
    isTransformed?: boolean;
    isTransported?: boolean;
    verifiedPercentage?: string;
    productDefinition?: ProductDefinitions;
    quantity?: number;
    quantityUnit?: string;
    additionalAttributes?: ManualAddedAttribute[];
    qrCode?: ProductManagement.QrCodeResponse | string;
  } & ManualAddedProduct;

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
    lotId?: SortType;
    code: SortType;
  }

  export type CottonAttributes = {
    trashContent: TrashContentEnum;
    moistureLevel: number;
    cottonCertification: string;
    grade: string;
  };

  export interface ManualRequestParams {
    totalWeight: number;
    weightUnit: string;
    cottonAttributes: CottonAttributes;
    price?: number;
    currency?: string;
    countryId: string;
    provinceId: string;
    districtId: string;
    uploadProofs: File[] | string[];
  }

  export interface ProductDefinitions {
    id: string;
    name: string;
    productDefinitionAttributes: ProductDefinitionAttribute[];
  }

  export type ProductDefinitionAttribute =
    ProductAttribute.ProductDefinitionAttribute;

  export type ManualAddedData = {
    productDefinitionId: string;
    manualAddedProducts: ManualAddedProduct[];
  };

  export type ManualAddedProduct = {
    code?: string;
    attributes?: ManualAddedAttribute[];
  };

  export type ManualAddedAttribute = ProductAttribute.AttributeParams;

  export type AttributeWeightUnit = {
    totalWeight: number;
    weightUnit: string;
  };

  export type RequiredSellers = {
    isSellerRequired: boolean;
    nonParticipatingRoleName: string;
  };
}
