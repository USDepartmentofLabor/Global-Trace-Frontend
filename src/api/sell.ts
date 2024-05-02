import httpRequest from './http-request';

export const getPartnerPurchasers = (
  params: App.searchKey,
): Promise<SellProduct.PartnerPurchaser[]> =>
  httpRequest.get('/partners/purchasers', { params });

export const sellProduct = (params: SellProduct.RequestParams): Promise<void> =>
  httpRequest.post(`/events/sells`, params);

export const getSoldProductDefinitions =
  (): Promise<ProductManagement.Product> =>
    httpRequest.get('/product-definitions/sold-product-definitions');

export const getSellProduct = (
  code: string,
): Promise<ProductManagement.Product> =>
  httpRequest.get(`/events/sells/products/${code}`);
