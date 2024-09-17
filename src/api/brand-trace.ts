import httpRequest from './http-request';

export const getTrace = (id: string): Promise<BrandSupplier.TraceProductData> =>
  httpRequest.get(`orders/${id}/traces`);

export const getOrderDetail = (id: string): Promise<BrandTrace.OrderDetail> =>
  httpRequest.get(`orders/${id}`);

export const getTraceSuppliers = (
  id: string,
): Promise<BrandSupplier.TraceSupplierMapGroup[]> =>
  httpRequest.get(`orders/${id}/traces/suppliers`);

export const getTraceList = (
  id: string,
  params: App.RequestParams,
): Promise<BrandSupplier.OrderSupplier[]> =>
  httpRequest.get(`orders/${id}/traces/lists`, { params });
