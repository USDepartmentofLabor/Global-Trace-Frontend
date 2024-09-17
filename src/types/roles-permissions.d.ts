declare namespace RoleAndPermission {
  import {
    PermissionActionEnum,
    PermissionGroupEnum,
    ChainOfCustodyEnum,
    RoleTypeEnum,
    GroupTypeEnum,
    RoleAttributeTypeEnum,
  } from 'enums/role';

  export type RequestParams = {
    key?: string;
    page?: number;
    perPage?: number;
    sortFields?: string;
    type?: string;
    canInvite?: boolean;
  };

  export interface Role {
    id: string;
    name: string;
    createdAt?: number;
    updatedAt?: number;
    type: RoleTypeEnum;
    chainOfCustody?: ChainOfCustodyEnum;
    permissions?: Permission[];
    groups?: PermissionGroup[];
    numOfPermissions?: number;
    totalPermissions?: number;
    isRawMaterialExtractor?: boolean;
    seasonStartDate?: string;
    seasonDuration?: number;
    uploadedSAQ?: boolean;
    attributes?: AttributeGroup;
    icon?: string;
  }

  export type AttributeGroup = {
    [x: RoleAttributeTypeEnum]: RoleAttributeParams[];
  };

  export type RoleParams = {
    name?: string;
    type?: RoleTypeEnum;
    assignedPermissionIds?: string[];
    isRawMaterialExtractor?: boolean;
    seasonStartDate?: string;
    seasonDuration?: number;
    chainOfCustody?: ChainOfCustodyEnum;
    attributes?: AttributesPayload[];
    icon?: string;
  };

  export type AttributesPayload = {
    attributeId: string;
    roleAttributeType: RoleAttributeTypeEnum;
    isOptional: boolean;
    order: number;
  };

  export type AttributeParams = {
    id: string;
    attribute: RoleAttribute;
    groupType: RoleAttributeTypeEnum;
    isOptional: boolean;
  };

  export interface RoleAttribute {
    id: string;
    createdAt: number;
    updatedAt: number;
    name: string;
    type: RoleAttributeTypeEnum;
    category: InputAttributeEnum;
    nameTranslation: {
      [x: string]: string;
    };
    options: RoleAttributeOption[];
  }

  export type RoleAttributeOption = {
    value: string;
    translation: {
      [x: string]: string;
    };
  };

  export interface RoleAttributeParams {
    id?: string;
    name: string;
    isOptional?: boolean;
    options: AttributeOptionParams[];
    attribute?: RoleAttribute;
    category?: InputAttributeEnum;
    value?: App.Any;
    quantityUnit?: string;
    type?: RoleAttributeTypeEnum;
  }

  export type AttributeType = {
    id: InputAttributeEnum;
    label: string;
  };

  export type AttributeOptionParams = {
    value: string;
  };

  export type SystemAttributeParams = {
    types: RoleAttributeTypeEnum[];
  };

  export type SystemAttributeResponse = {
    [x: string]: RoleAttribute[];
  };

  export type RoleValidateParams = {
    id?: string;
    name: string;
  };

  export type PermissionParams = {
    id: string;
    metadataId?: string;
    metadata?: PermissionMetadata[];
  };

  export interface Permission {
    id: string;
    name?: sting;
    group?: PermissionGroup;
    setName?: string;
    set?: number;
    action?: PermissionActionEnum;
    metadata?: PermissionMetadata;
    label?: string;
    description?: string;
    subPermissions?: Permission[];
  }

  export type NewPermission = {
    id: string;
    name: string;
    action?: PermissionActionEnum;
    groupType?: GroupTypeEnum;
    subPermissions: Permission[];
  };

  export interface PermissionCookie {
    action: PermissionActionEnum;
  }

  export type PermissionMetadata = {
    purchaseFrom?: string[];
    sellTo?: string[];
    invitePartner?: string[];
    transportTo?: string[];
  };

  export type PermissionGrouped = {
    [PermissionGroupEnum]: Permission[];
  };

  export type ValuesGroups = {
    [x: string]: string[];
  };

  export type PermissionGroup = {
    id: string;
    name: PermissionGroupEnum;
    sortOrder: number;
    permissions?: Permission[];
  };

  export type RoleTypeParams = {
    roleType: RoleTypeEnum;
  };

  export type RadioGroup = {
    label?: string;
    value: string;
    groupOptions: App.CheckboxGroup[];
  };
}
