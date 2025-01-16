import httpRequest from './http-request';

export const getPartnerTransporters = (): Promise<
  Transport.PartnerTransporter[]
> => httpRequest.get(`/partners/transporters`);

export const createTransport = (
  params: Transport.RequestParams,
): Promise<void> => httpRequest.post(`/events/transports`, params);

export const getTransportProduct = (
  code: string,
): Promise<ProductManagement.Product> =>
  httpRequest.get(`/events/transports/products/${code}`);
