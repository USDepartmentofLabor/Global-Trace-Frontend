declare namespace SiteSetting {
  export type BusinessDetail = {
    id?: string;
    sector?: string;
    country?: string;
    startDateOfSeason: string;
    logo: Logo;
  };

  export type BusinessDetailParams = {
    startDateOfSeason: string;
  };

  export type GPSStatus = {
    isGpsEnabled: boolean;
  };

  export type LocationParams = {
    lat: number;
    lng: number;
  };

  export type LocationResponse = {
    address: string;
  };
}
