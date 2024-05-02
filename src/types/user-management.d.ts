declare namespace UserManagement {
  import { UserStatusEnum } from 'enums/user';
  import { RoleTypeEnum } from 'enums/role';

  export type UserRequestParams = {
    isSupplier?: boolean;
    roles?: RoleAndPermission.Role[];
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
    isSupplier: boolean;
    status?: UserStatusEnum;
    businessName?: string;
    brandInformation?: Auth.BrandInformation;
    supplierInformation?: Auth.SupplierInformation;
    tier?: string;
    facilityType?: string;
    roleType?: RoleTypeEnum;
  }

  export interface FacilityParams {
    typeId: string;
    tier: string;
  }

  export interface EditParams {
    user: UserStatusParams;
    facility?: FacilityParams;
  }
}
