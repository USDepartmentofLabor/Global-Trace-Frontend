import httpRequest from './http-request';

export const getRoleList = (
  params?: RoleAndPermission.RequestParams,
): Promise<RoleAndPermission.Role[]> => httpRequest.get('/roles', { params });

export const createRole = (
  params: RoleAndPermission.RoleParams,
): Promise<void> => httpRequest.post('/roles', params);

export const getRole = (id: string): Promise<RoleAndPermission.Role> =>
  httpRequest.get(`/roles/${id}`);

export const updateRole = (
  id: string,
  params: RoleAndPermission.RoleParams,
): Promise<void> => httpRequest.put(`/roles/${id}`, params);

export const deleteRole = (id: string): Promise<void> =>
  httpRequest.delete(`/roles/${id}`);

export const getIdentifierTypes = (): Promise<App.DropdownOption[]> =>
  httpRequest.get('/role-attributes/identifier-system-types');

export const getAdditionalAttributes = (): Promise<
  RoleAndPermission.RoleAttribute[]
> => httpRequest.get('/role-attributes');

export const createAdditionalAttribute = (
  params: RoleAndPermission.RoleParams,
): Promise<RoleAndPermission.RoleAttribute> =>
  httpRequest.post('/role-attributes', params);

export const updateAdditionalAttribute = (
  id: string,
  params: RoleAndPermission.RoleParams,
): Promise<void> => httpRequest.put(`/role-attributes/${id}`, params);

export const deleteAdditionalAttribute = (id: string): Promise<void> =>
  httpRequest.delete(`/role-attributes/${id}`);

export const getRoleAttributes = (
  params: RoleAndPermission.SystemAttributeParams,
): Promise<RoleAndPermission.SystemAttributeResponse> =>
  httpRequest.get('/role-attributes/identifier-systems', { params });
