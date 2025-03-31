declare namespace AuditorOnboard {
  export type ProfileRequestParams = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    businessName: string;
    businessRegisterNumber: string;
    countryId: string;
    provinceId: string;
    districtId: string;
    address: string;
  };

  export interface ProfileFormData {
    user?: Auth.User;
    facility?: Auth.Facility;
  }
}
