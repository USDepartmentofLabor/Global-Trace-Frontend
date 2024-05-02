declare namespace ProductManagement {
  import('enums/product');

  import {
    ProductAttributeEnum,
    ProductAttributeTypeEnum,
  } from 'enums/product';

  export interface Product {
    id: string;
    createdAt: number;
    updatedAt: number;
    name: string;
    nameTranslation: {
      [x: string]: string;
    };
    productDefinitionAttributes: ProductDefinitionAttribute[];
    attributes?: ProductAttributeParams[];
    additionalAttributes?: ProductAttributeParams[];
    isSold?: boolean;
    isTransported?: boolean;
    qrCode?: QrCodeResponse;
  }

  export type QrCodeResponse = {
    code: string;
  };

  export interface ProductDefinitionAttribute {
    id: string;
    createdAt: number;
    updatedAt: number;
    productDefinitionId: string;
    attributeId: string;
    order: number;
    attribute: ProductAttribute;
    isOptional: boolean;
    isAddManuallyOnly: boolean;
  }

  export interface ProductAttribute {
    id: string;
    createdAt: number;
    updatedAt: number;
    name: string;
    type: ProductAttributeTypeEnum;
    category: ProductAttributeEnum;
    nameTranslation: {
      [x: string]: string;
    };
    options: ProductOption[];
  }

  export type ProductOption = {
    value: string;
    translation: {
      [x: string]: string;
    };
  };

  export interface ProductParams {
    name: string;
    attributes: AttributeParams[];
  }

  export type AttributeParams = {
    id: string;
    attribute?: ProductAttribute;
    isOptional: boolean;
    isAddManuallyOnly: boolean;
  };

  export interface ProductAttributeParams {
    id?: string;
    name: string;
    type: ProductAttributeTypeEnum;
    isOptional?: boolean;
    isAddManuallyOnly?: boolean;
    options: ProductOptionParams[];
    attribute?: ProductAttribute;
    category?: ProductAttributeEnum;
    value?: App.Any;
    quantityUnit?: string;
  }

  export type ProductOptionParams = {
    value: string;
  };

  export interface AttributeFilterParams {
    name: SortType;
    type?: SortType;
  }

  export type RequestParams = {
    page?: number;
    key?: string;
    perPage?: number;
    sortFields?: string;
  };

  export type AttributeType = {
    id: ProductAttributeEnum;
    label: string;
  };

  export type AddedProduct = {
    code?: string;
    attributes?: ProductAttribute.AttributeParams[];
    qrCode?: string | QrCodeResponse;
    addedTime?: number;
    dnaIdentifier?: string;
  };
}
