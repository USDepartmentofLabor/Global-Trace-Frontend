declare namespace BrandOnboard {
  export type RequestParams = {
    name: string;
    logo?: File;
    businessRegisterNumber: string;
    countryId: string;
    provinceId: string;
    districtId: string;
    address: string;
  };
}
