import httpRequest from './http-request';

export const getBusinessDetail = (): Promise<SiteSetting.BusinessDetail> =>
  httpRequest.get('/business-details');

export const getAppLogo = (): Promise<SiteSetting.Logo> =>
  httpRequest.get('/app-logo');

export const updateBusinessDetail = (
  params: SiteSetting.BusinessDetailParams,
): Promise<void> => httpRequest.put('/business-details', params);

export const finishConfigurationSystems = (): Promise<void> =>
  httpRequest.post('/business-details/configuration-systems');
