declare namespace SystemProfile {
  export interface BusinessDetail {
    countryIds: string[];
    commodities: string[];
    name: string;
    logo: Logo;
  }

  export type Logo = {
    fileName: string;
    link: string;
    blobName: string;
  };

  export type Country = {
    id: string;
    countryCode: string;
    country: string;
  };

  export type BusinessDetailParams = {
    name: string;
    commodities: string[];
    countryIds: string[];
    logo: File;
  };

  export type Commodities = {
    commodity: string;
  };
}
