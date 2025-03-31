import httpRequest from './http-request';

export const assignProducts = (
  params: AssignProduct.AssignProductRequestParams,
): Promise<void> => httpRequest.post('/events/assign-products', params);

export const getSoldProductDefinitions = (): Promise<
  ProductManagement.Product[]
> => httpRequest.get('/product-definitions/sold-product-definitions');

export const getInputProduct = (code: string): Promise<AssignProduct.Product> =>
  httpRequest.get(`/events/assign-products/products/${code}`);

export const getSellProduct = (code: string): Promise<AssignProduct.Product> =>
  httpRequest.get(`/events/sells/products/${code}`);
