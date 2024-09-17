import httpRequest from './http-request';

export const getOrderSupplier = async (
  orderId: string,
  supplierId: string,
): Promise<BrandTrace.OrderSupplier> => {
  return httpRequest.get(`/orders/${orderId}/suppliers/${supplierId}`);
};

export const selectOrderSupplier = async (
  params: BrandTrace.OrderSupplierRequestParams,
): Promise<void> => {
  const { orderId } = params;
  return httpRequest.post(`/orders/${orderId}/suppliers`, params);
};

export const updateOrderSupplier = async (
  params: BrandTrace.OrderSupplierRequestParams,
): Promise<void> => {
  const { orderId, orderSupplierId } = params;
  return httpRequest.put(
    `/orders/${orderId}/suppliers/${orderSupplierId}`,
    params,
  );
};

export const removeOrderSupplier = async (
  orderId: string,
  supplierId: string,
): Promise<void> => {
  return httpRequest.delete(`/orders/${orderId}/suppliers/${supplierId}`);
};
