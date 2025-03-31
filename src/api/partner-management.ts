import httpRequest from './http-request';

export const getPartnerList = (
  params: PartnerManagement.RequestParams,
): Promise<App.ListItem<PartnerManagement.Partner>> =>
  httpRequest.get('/partners', { params });

export const deletePartner = (partnerId: string): Promise<void> =>
  httpRequest.delete(`/partners/${partnerId}`);
