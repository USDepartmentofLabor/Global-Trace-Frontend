import httpRequest from './http-request';

export const getAllCountries = (): Promise<Location.Country[]> =>
  httpRequest.get('/locations/all-countries');

export const getProvinceList = (
  params: Location.ProvinceRequestParams,
): Promise<Location.Province[]> =>
  httpRequest.get('/locations/provinces', { params });

export const getDistrictList = (
  params: Location.DistrictRequestParams,
): Promise<Location.District[]> =>
  httpRequest.get('/locations/districts', { params });
