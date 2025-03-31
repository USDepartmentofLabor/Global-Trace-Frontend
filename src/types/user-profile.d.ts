declare namespace UserProfile {
  export type ProfileRequestParams = {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    businessName?: string;
    oarId?: string;
    businessRegisterNumber?: string;
    country?: string;
    province?: string;
    district?: string;
    address?: string;
    certification?: string;
    chainOfCustody?: string;
    reconciliationStartAt?: number;
    reconciliationDuration?: string;
    goods: string[];
  };
}
