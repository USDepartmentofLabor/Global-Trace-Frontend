declare namespace Auth {
  import { UserStatusEnum, UserRoleEnum } from 'enums/user';
  import { LevelRiskCategoryEnum } from 'enums/saq';

  export type UserCertificate = {
    email: string;
    password: string;
  };

  export type BrandInformation = {
    name: string;
  };

  export type SupplierInformation = {
    name: string;
    tier: string;
  };

  export interface Facility {
    id?: string;
    name: string;
    businessRegisterNumber?: string;
    type?: FacilityType;
    typeId?: string;
    address?: string;
    traderName?: string;
    oarId?: string;
    facilityId?: string;
    certification?: string;
    countryId?: string;
    country?: Location.Country;
    provinceId?: string;
    province?: Location.Province;
    districtId?: string;
    district?: Location.District;
    chainOfCustody?: string;
    reconciliationDuration?: string;
    reconciliationStartAt?: number;
    partners?: Onboard.Partner[];
    users?: User[];
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    grievanceReports?: GrievanceReport.Report[];
    orderSupplierId?: string;
    logo?: string;
    farmGroupId?: string;
    farmId?: string;
    farms?: Facility[];
    additionalInformation?: FacilityManagement.AdditionalInformation;
    riskScoreTracings?: ScoreGroup[];
    selfAssessment?: BrandSupplier.SelfAssessment;
    riskLevel?: PDFPreview.RiskLevel;
    facilityPartners?: BrandSupplier.PartnerFacility[];
    goods?: string[];
    riskData?: RiskData;
    type: SupplierType;
  }

  export type RiskData = {
    overallRisk: Risk;
    countryRisk: Risk;
    data: SupplierData[];
  };

  export type Risk = {
    score: number;
    level: LevelRiskCategoryEnum;
  };

  export type SupplierData = {
    category: Category;
    risk: Risk;
    indicatorRiskData: IndicatorRiskData[];
    sourceRiskData: SourceRiskData[];
  };

  export type Category = {
    id: string;
    name: string;
    translation: {
      [x: string]: string;
    };
  };

  export type IndicatorRiskData = {
    indicator: Indicator;
    risk: Risk;
    subIndicatorRiskData: SubIndicatorRiskData[];
  };

  export type Indicator = {
    id: string;
    name: string;
  };

  export type SubIndicatorRiskData = {
    subIndicator: Indicator;
    risk: Risk;
    data: SubIndicatorData[];
  };

  export type SubIndicatorData = {
    createdAt: number;
    source: string;
    isIndirect: boolean;
    risk: Risk;
    note: string;
  };

  export type SourceRiskData = {
    source: string;
    risk: Risk;
  };

  export type ViewRisk = {
    title: string;
    risk: Risk;
  };

  export type SupplierType = {
    id: string;
    name: string;
  };

  export type ScoreGroup = {
    groupName: string;
    groups: GroupInfo[];
    riskScore?: number;
  };

  export type GroupInfo = {
    status: string;
    type: string;
  };

  export interface User {
    id?: string;
    email?: string;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    isSupplier?: boolean;
    name?: string;
    address?: string;
    joined?: string;
    status?: UserStatusEnum;
    permissions?: RoleAndPermission.Permission[];
    role?: RoleAndPermission.Role;
    brandInformation?: BrandInformation;
    lastLoginAt?: number;
    deletedAt?: number;
    joinedAt?: number;
    facilities?: Facility[];
    updatedProfileAt?: number;
    answeredSaqAt?: number;
    addedPartnerAt?: number;
    completedConfiguringSystemAt?: number;
    totalAwaitingReports?: number;
    latestActivityAt?: number;
    supplierInformation?: SupplierInformation;
    currentFacility?: Facility;
  }

  export type FacilityType = {
    id: string;
    name: string | UserRoleEnum;
  };

  export interface UserAuthentication {
    expireAt: number;
    token: string;
    user: User;
  }

  export type UserRegistration = {
    password: string;
    token: string;
  };

  export type ShortToken = {
    shortToken: string;
  };
}
