export enum UserStatusEnum {
  ACTIVE = 1,
  DEACTIVATED = 2,
  INVITED = 3,
}

export enum UserRoleEnum {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  FARM = 'FARM',
  FARM_GROUP = 'FARM_GROUP',
  GINNER = 'GINNER',
  SPINNER = 'SPINNER',
  BROKER = 'BROKER',
  TRANSPORTER = 'TRANSPORTER',
  MILL = 'MILL',
  BRAND = 'BRAND',
  AUDITOR = 'AUDITOR',
  FARM_MONITOR = 'FARM_MONITOR',
  FARM_MONITOR_WEB = 'FARM_MONITOR_WEB',
  SUPPLIER = 'SUPPLIER',
  FINAL_PRODUCT_ASSEMBLY = 'FINAL_PRODUCT_ASSEMBLY',
}

export enum TransformPartnerTypeEnum {
  GINNER = 'ginner',
  SPINNER = 'spinner',
  MILL = 'mill',
  FARM = 'farm',
}

export enum FacilityTypeEnum {
  FARM_GROUP = 1,
  GINNER = 2,
  SPINNER = 3,
  BROKER = 4,
  TRANSPORTER = 5,
  MILL = 6,
  BRAND = 7,
  AUDITOR = 8,
  FARM_MONITOR = 9,
  FINAL_PRODUCT_ASSEMBLY = 10,
  FARM = 11,
}

export enum TransformUserRoleEnum {
  ADMIN = 'Admin',
  FARM = 'Farm',
  FARM_GROUP = 'Farm group',
  GINNER = 'Ginner',
  SPINNER = 'Spinner',
  BROKER = 'Broker',
  TRANSPORTER = 'Transporter',
  MILL = 'Fabric Mill',
  BRAND = 'Brand',
  AUDITOR = 'Auditor',
  FARM_MONITOR = 'Farm monitor',
  SUPPLIER = 'Supplier',
  FINAL_PRODUCT_ASSEMBLY = 'Final product assembly',
}

export enum SupplierStatusEnum {
  READY = 'ready',
  DRAFT = 'draft',
  UNKNOWN = 'unknown',
}

export enum SignOutTypeEnum {
  SIGN_OUT = 'SIGN_OUT',
  DELETE_MY_ACCOUNT = 'DELETE_MY_ACCOUNT',
}
