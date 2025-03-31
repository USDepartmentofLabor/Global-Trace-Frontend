declare namespace UserManagement {
  import { UserStatusEnum } from 'enums/user';
  import { RoleTypeEnum } from 'enums/role';

  export type UserRequestParams = {
    isSupplier?: boolean;
    role?: RoleAndPermission.Role;
    user?: Auth.User;
  };

  export type RequestParams = {
    page?: number;
    perPage?: number;
    sortFields?: string;
  };

  export interface User {
    firstName: string;
    lastName: string;
    email: string;
    roleId?: string;
    isSupplier?: boolean;
    status?: UserStatusEnum;
    businessName?: string;
    brandInformation?: Auth.BrandInformation;
    supplierInformation?: Auth.SupplierInformation;
    facilityType?: string;
    roleType?: RoleTypeEnum;
    userApiLimit?: UserApiLimit;
    editableExternalRiskIndexIds?: string[];
    maximumCreateExternalRiskIndex?: string;
  }

  export interface FacilityParams {
    typeId: string;
  }

  export interface EditParams {
    user: UserStatusParams;
    facility?: FacilityParams;
  }

  export type UserApiLimit = {
    editableExternalRiskIndexIds?: string[];
    maximumCreateExternalRiskIndex?: number;
  };
}
