import httpRequest from './http-request';

export const getOrderList = async (
  params: App.RequestParams,
): Promise<App.ListItem<BrandProduct.Order>> =>
  httpRequest.get(`/orders`, { params });

export const getSuppliers = async (
  params: BrandSupplier.SupplierPartnerRequestParams,
): Promise<Auth.Facility[]> => httpRequest.get('/facilities/list', { params });

export const getPartnerSuppliers = (
  supplierId: string,
  params: BrandSupplier.SupplierPartnerRequestParams,
): Promise<Auth.Facility[]> =>
  httpRequest.get(`/facilities/${supplierId}/partner-suppliers`, {
    params,
  });

export const addOrder = async (
  params: BrandProduct.Order,
): Promise<BrandProduct.Order> => httpRequest.post(`/orders`, params);

export const editOrder = async (
  id: string,
  params: BrandProduct.Order,
): Promise<void> => httpRequest.put(`/orders/${id}`, params);

export const deleteOrder = async (id: string): Promise<void> =>
  httpRequest.delete(`/orders/${id}`);

export const getOrderById = async (id: string): Promise<BrandProduct.Order> =>
  httpRequest.get(`/orders/${id}`);
