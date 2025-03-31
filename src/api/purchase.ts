import httpRequest from './http-request';

export const getPurchaseProduct = (code: string): Promise<Purchase.Product> =>
  httpRequest.get(`/events/purchases/products/${code}`);

export const getPartnerSellers = (
  params: Purchase.PartnerSellerParam,
): Promise<Purchase.PartnersSeller[]> =>
  httpRequest.get(`/partners/sellers`, { params });

export const createPurchaseProduct = (
  params: Purchase.PurchaseRequestParams,
): Promise<void> => httpRequest.post(`/events/purchases`, params);

export const getPurchasedProductDefinitions = (): Promise<
  ProductManagement.Product[]
> => httpRequest.get('/product-definitions/purchased-product-definitions');

export const getRequiredSellers = (): Promise<Purchase.RequiredSellers> =>
  httpRequest.get('/events/purchases/required-sellers');
