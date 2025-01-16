declare namespace Location {
  export type RequestParams = {
    countryId: string;
    provinceId: string;
    districtId: string;
  };

  export type Country = {
    id: string;
    country: string;
    countryCode: string;
  };

  export type Province = {
    id: string;
    province: string;
    provinceCode: string;
  };

  export type District = {
    id: string;
    district: string;
    districtCode: string;
  };

  export type CountryRequestParams = {
    perPage?: number;
  };

  export type ProvinceRequestParams = {
    countryId: string;
    perPage?: number;
  };

  export type DistrictRequestParams = {
    provinceId: string;
    perPage?: number;
  };
}
