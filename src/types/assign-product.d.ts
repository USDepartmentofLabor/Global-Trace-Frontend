declare namespace AssignProduct {
  import { SortType, TrashContentEnum } from 'enums/app';

  export type OutputProduct = {
    code: string;
    totalWeight: number;
    weightUnit: string;
    dnaIdentifier: string;
    description: string;
    createdAt?: number;
    files: Files[] | string[];
  };

  export type AssignProductRequestParams = {
    inputProductIds?: string[];
    outputProduct: OutputProductParams;
  };

  export type OutputProductParams = {
    productDefinitionId: string;
    outputProducts: OutputProducts[];
  };

  export type OutputProducts = {
    attributes: ProductAttribute.AttributeParams[];
  };

  export interface AssignProductParams {
    inputProductList: string[];
    outputProductList: OutputProduct[];
  }

  export type Product = {
    id: string;
    lotId?: string;
    isHavingCertification?: boolean;
    cottonCertification?: string;
    grade?: string;
    totalWeight?: number;
    weightType?: string;
    moistureLevel?: number;
    trashContent?: TrashContentEnum;
    code?: string;
    description?: string;
    dnaIdentifier?: string;
    totalWeight?: number;
    weightUnit?: string;
    certifications?: string[];
    isTransformed?: boolean;
    isManualAdded?: boolean;
    isPurchased: boolean;
    isSold: boolean;
    isTransported: boolean;
    attributes?: ProductAttributeData[];
    additionalAttributes?: ProductAttributeData[];
    createdAt?: number;
  };

  export interface ProductLotFilterParams {
    createdAt: SortType;
    code: SortType;
  }

  export interface LotFilterParams {
    createdAt: SortType;
    lotId?: SortType;
  }

  export type ValidateParams = {
    code: string;
  };

  export type OutputProductData = ProductManagement.AddedProduct;

  export type OutputProductAttribute = ProductAttribute.AttributeParams;
}
