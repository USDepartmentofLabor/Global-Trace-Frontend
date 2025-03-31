declare namespace AuditorProfile {
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

  export type ChangePasswordParams = {
    oldPassword: string;
    password?: string;
    newPassword: string;
  };
}
