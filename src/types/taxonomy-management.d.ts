declare namespace TaxonomyManagement {
  import {
    ImportActionEnum,
    RiskSeverityEnum,
    CategoryTypeEnum,
  } from 'enums/taxonomy-exploitation';

  export type RequestParams = {
    page?: number;
    key?: string;
    perPage?: number;
    sortFields?: string;
    categoryIds?: string[];
    indicatorIds?: string[];
    subIndicatorIds?: string[];
  };

  export interface TaxonomyExploitation {
    id: string;
    name: string;
    category: string;
    indicator: Indicator;
    subIndicator: SubIndicator;
    type: CategoryTypeEnum;
    riskSeverity: RiskSeverityEnum;
  }

  export type Indicator = {
    id: string;
    name: string;
  };

  export type SubIndicator = {
    id: string;
    name: string;
    riskSeverity: RiskSeverityEnum;
  };

  export type TaxonomyExploitationParams = {
    category: string;
    indicatorName: string;
    subIndicatorName: string;
    riskSeverity: number;
  };

  export type ImportParams = {
    action: ImportActionEnum;
  };

  export type UploadedFileResponse = {
    updatedTaxonomyTranslations: UpdatedTaxonomyTranslations;
    validationErrors?: ValidationError[];
  };

  export type UpdatedTaxonomyTranslations = {
    id: string;
    name: string;
    translation: {
      [x: string]: string;
    };
  };

  export type FilterParams = {
    categoryIds?: string[];
    indicatorIds?: string[];
    subIndicatorIds?: string[];
  };

  export interface CategoryIcon {
    id: string;
    name: string;
    icon: string;
    type: CategoryTypeEnum;
  }

  export type CategoryIconParams = {
    settingIconCategories: SettingIconCategory[];
  };

  export type SettingIconCategory = {
    icon: string;
    categoryId: string;
  };
}
