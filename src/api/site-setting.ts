import httpRequest from './http-request';

export const getBusinessDetail = (): Promise<SiteSetting.BusinessDetail> =>
  httpRequest.get('/business-details');

export const getAppLogo = (): Promise<App.FileResponse> =>
  httpRequest.get('/app-logo');

export const updateBusinessDetail = (
  params: SiteSetting.BusinessDetailParams,
): Promise<void> => httpRequest.put('/business-details', params);

export const finishConfigurationSystems = (): Promise<void> =>
  httpRequest.post('/business-details/configuration-systems');

export const getGPSStatus = (): Promise<SiteSetting.GPSStatus> =>
  httpRequest.get('/business-details/gps-status');

export const getGPSLocation = (
  params: SiteSetting.LocationParams,
): Promise<SiteSetting.LocationResponse> =>
  httpRequest.get('/business-details/address', { params });

export const switchToConfiguration = (): Promise<void> =>
  httpRequest.post('/business-details/switch-to-configuration');
