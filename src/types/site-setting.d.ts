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

  export type Logo = {
    blobName: string;
    fileName: string;
    link: string;
  };
}
