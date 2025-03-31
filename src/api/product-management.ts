import httpRequest from './http-request';

export const getProducts = (): Promise<ProductManagement.Product[]> =>
  httpRequest.get('/product-definitions');

export const createProduct = (
  params: ProductManagement.ProductParams,
): Promise<void> => httpRequest.post('/product-definitions', params);

export const getProduct = (id: string): Promise<ProductManagement.Product> =>
  httpRequest.get(`/product-definitions/${id}`);

export const updateProduct = (
  id: string,
  params: ProductManagement.ProductParams,
): Promise<void> => httpRequest.put(`/product-definitions/${id}`, params);

export const getAttributes = (): Promise<
  ProductManagement.ProductAttribute[]
> => httpRequest.get('/attributes');

export const createAttribute = (
  params: ProductManagement.ProductAttributeParams,
): Promise<ProductManagement.ProductAttribute> =>
  httpRequest.post('/attributes', params);

export const updateAttribute = (
  id: string,
  params: ProductManagement.ProductAttributeParams,
): Promise<void> => httpRequest.put(`/attributes/${id}`, params);

export const deleteAttribute = (id: string): Promise<void> =>
  httpRequest.delete(`/attributes/${id}`);

export const deleteProduct = (id: string): Promise<void> =>
  httpRequest.delete(`/product-definitions/${id}`);
