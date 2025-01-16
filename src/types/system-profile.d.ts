declare namespace SystemProfile {
  export interface BusinessDetail {
    name: string;
    logo: Logo;
    isGpsEnabled: boolean;
  }

  export type Country = {
    id: string;
    countryCode: string;
    country: string;
  };

  export type BusinessDetailParams = {
    name: string;
    logo: File;
    isGpsEnabled: boolean;
  };

  export type Commodities = {
    commodity: string;
  };
}
