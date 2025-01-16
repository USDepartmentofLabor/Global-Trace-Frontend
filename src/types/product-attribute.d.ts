declare namespace ProductAttribute {
  import('enums/product');
  import('enums/app');

  import { InputAttributeEnum } from 'enums/app';
  import { ProductAttributeTypeEnum } from 'enums/product';

  export interface Entity {
    id: string;
    name: string;
    type: ProductAttributeTypeEnum;
    category: InputAttributeEnum;
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
    value?: App.Any;
    quantityUnit?: string;
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
    category: InputAttributeEnum;
    value: App.Any;
    files?: App.SelectedFile[];
    quantityUnit?: string;
    isOptional: boolean;
    name?: string;
    attribute?: Entity;
  };

  export type ValidateInputParams = {
    category?: InputAttributeEnum;
    value: App.Any;
    isOptional?: boolean;
    quantityUnit?: string;
  };

  export type ProductAttributeData = {
    code?: string;
    attributes?: OutputProductAttribute[];
    addedTime?: number;
  };
}
