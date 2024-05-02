declare namespace Onboard {
  import {
    PartnerTypeEnum,
    FacilityTypeEnum,
    OarIdStatusEnum,
  } from 'enums/onboard';
  import { UserRoleEnum } from 'enums/user';

  export type Menu = {
    name: string;
    isDone: boolean;
    isDisabled: boolean;
    isFail?: boolean;
    onClick: () => void;
  };

  export type ProfileRequestParams = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    businessName: string;
    businessRegisterNumber: string;
    oarId: string;
    countryId: string;
    provinceId: string;
    districtId: string;
    certification: string;
    goods: string[];
    chainOfCustody?: string;
    address: string;
    reconciliationStartAt?: number;
    reconciliationDuration?: string;
  };

  export type BusinessAddressParams = {
    countryId: string;
    provinceId: string;
    districtId: string;
    address?: string;
  };

  export type BusinessModelParams = {
    certification: string;
    chainOfCustody?: string;
    reconciliationStartAt?: number;
    reconciliationDuration?: string;
  };

  export interface ProfileFormData {
    user?: Auth.User;
    facility?: Auth.Facility;
  }

  export type RegisterOarIdParams = {
    name: string;
    countryId: string;
    provinceId: string;
    districtId: string;
    address: string;
  };

  export type OARParams = {
    oarId: string;
  };

  export interface OAR {
    id: string;
    user: Auth.User;
  }

  export type OAROption = {
    value: string;
    title: string;
    subTitle?: string;
    note?: string;
  };

  export type FacilityListRequestParams = {
    partnerType?: string;
    key?: string;
  };

  export interface Partner {
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    role?: string;
    facilityId?: string;
    businessName?: string;
    facilities?: Auth.Facility[];
    transporterInformation?: Auth.Facility;
    ginnerInformation?: Auth.Facility;
    millInformation?: Auth.Facility;
    brokerInformation?: Auth.Facility;
    addNew?: boolean;
    facilityInformation?: PartnerFacilityInformation;
    userInformation?: UserInfoRequestParams;
  }

  export interface InvitePartner {
    userInformation?: UserInfoRequestParams;
    facilityId?: string;
    facilityInformation?: PartnerFacilityInformation;
    transporterInformation?: Auth.Facility;
    brokerInformation?: Auth.Facility;
    partners?: Partner[];
  }

  export interface PartnerFacilityInformation {
    roleId: string;
    name: string;
    countryId?: string;
    provinceId?: string;
    districtId?: string;
    address?: string;
  }

  export interface PartnerOption {
    id: string;
    name: string;
    type?: PartnerTypeEnum;
    facilityType?: FacilityTypeEnum;
    disabled?: boolean;
  }

  export interface PartnerDetail {
    id: string;
    user: Auth.User;
  }

  export type PartnerModalProps = {
    type?: PartnerTypeEnum;
    partner?: PartnerDetail;
  };

  export interface PartnerRequestParams {
    businessName: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    role?: UserRoleEnum;
    oarId?: string;
    businessRegisterNumber?: string;
    countryId?: string;
    provinceId?: string;
    districtId?: string;
    address?: string;
    certification?: string;
  }

  export type UserInfoRequestParams = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
  };

  export type BusinessRequestParams = {
    name: string;
    businessRegisterNumber?: string;
  };

  export type Location = {
    countryId?: string;
    provinceId?: string;
    districtId?: string;
    address?: string;
  };

  export type OarIdParam = { id: string };

  export type OarIdItem = {
    matches: OarIdDetail[];
    status: OarIdStatusEnum;
    oarId: string;
  };

  export type OarIdDetail = {
    name?: string;
    address?: string;
    oarId?: string;
    countryId?: string;
    country?: Location.Country;
    provinceId?: string;
    province?: Location.Province;
    districtId?: string;
    district?: Location.District;
    confirmMatchUrl?: string;
    rejectMatchUrl?: string;
    facilityMatchId?: string;
    isConfirmed?: boolean;
    isMatched?: boolean;
  };

  export type OarIdProperties = {
    name: string;
    address: string;
    oarId: string;
  };

  export type OaiIdResponse = {
    matches: [];
    itemId: number;
    geocodedGeometry: {
      type: string;
      coordinates: number[];
    };
    geocodedAddress: string;
    status: string;
  };

  export type BusinessPartnerParams = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    countryId: string;
    provinceId: string;
    districtId: string;
    name: string;
    facilityId: string;
  };

  export type CheckOarIdParams = {
    oarId: string;
    page: number;
    pageSize: number;
  };

  export type OarIdCollection = {
    id: string;
    properties: OarIdProperties;
  };

  export type PartnerRolesParams = {
    canInvite: boolean;
  };
}
