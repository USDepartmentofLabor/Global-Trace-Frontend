declare namespace ProductAttribute {
  import('enums/product');
  import('enums/app');

  import {
    ProductAttributeEnum,
    ProductAttributeTypeEnum,
  } from 'enums/product';

  export interface Entity {
    id: string;
    name: string;
    type: ProductAttributeTypeEnum;
    category: ProductAttributeEnum;
    nameTranslation?: {
      [x: string]: string;
    };
    options?: ProductOption[];
    name?: string;
    isOptional?: boolean;
    label?: string;
  }

  export interface ProductDefinitionAttribute {
    id?: string;
    productDefinitionId?: string;
    attributeId: string;
    order: number;
    attribute: Entity;
    isOptional: boolean;
    isAddManuallyOnly: boolean;
  }

  export type ProductOption = {
    value: string;
    translation: {
      [x: string]: string;
    };
  };

  export type WeightUnitParams = {
    totalWeight: number;
    weightUnit: string;
  };

  export type AttributeParams = {
    id: string;
    type: ProductAttributeTypeEnum;
    category: ProductAttributeEnum;
    value: App.Any;
    quantityUnit?: string;
    isOptional: boolean;
    name?: string;
    attribute?: Entity;
  };

  export type ProductAttributeData = {
    code?: string;
    attributes?: OutputProductAttribute[];
    addedTime?: number;
  };
}
