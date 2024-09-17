import { jsonToFormData } from 'utils/helpers';
import httpRequest from './http-request';

export const getSuppliers = (
  params: App.RequestParams,
): Promise<App.ListItem<Auth.Facility>> =>
  httpRequest.get('/brands/suppliers', { params });

export const getSupplierMapping = (): Promise<
  BrandSupplier.SupplierMapGroup[][]
> => httpRequest.get('/brands/suppliers/mapping');

export const createSupplier = (
  params: BrandSupplier.SupplierRequestParams,
): Promise<Auth.Facility> => httpRequest.post('/brands/suppliers', params);

export const getBusinessPartners = (
  params: BrandSupplier.BusinessPartnerRequest,
): Promise<BrandSupplier.Partner[]> =>
  httpRequest.get('/brands/business-partners', { params });

export const getBrandRoles = (): Promise<RoleAndPermission.Role[]> =>
  httpRequest.get('/brands/roles');

export const searchBrandSupplier = (
  params: BrandSupplier.SupplierPartnerRequestParams,
  signal: AbortSignal = null,
): Promise<Auth.Facility[]> =>
  httpRequest.get('/brands/suppliers/search', { params, signal });

export const getFacilityById = (
  id: string,
  params?: FacilityManagement.FilterParams,
): Promise<Auth.Facility> =>
  httpRequest.get(`/facilities/${id}`, {
    params,
  });

export const updateSupplier = (
  id: string,
  data: BrandSupplier.SupplierRequestParams,
): Promise<void> => httpRequest.put(`/brands/suppliers/${id}`, data);

export const deleteSupplier = (id: string): Promise<void> =>
  httpRequest.delete(`/brands/suppliers/${id}`);

export const validateSupplierTemplate = (
  param: Files.UploadedFileParam,
): Promise<Files.UploadedFileResponse> =>
  httpRequest.post(
    '/files/validate-supplier-templates',
    jsonToFormData(param),
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );

export const importSuppliers = (fileId: string): Promise<void> =>
  httpRequest.post(`/files/${fileId}/import-suppliers`);
