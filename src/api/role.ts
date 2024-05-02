import httpRequest from './http-request';

export const getRoleList = (
  params?: RoleAndPermission.RequestParams,
): Promise<RoleAndPermission.Role[]> => httpRequest.get('/roles', { params });

export const createRole = (
  params: RoleAndPermission.RoleParams,
): Promise<void> => httpRequest.post('/roles', params);

export const updateRole = (
  id: string,
  params: RoleAndPermission.RoleParams,
): Promise<void> => httpRequest.put(`/roles/${id}`, params);

export const deleteRole = (id: string): Promise<void> =>
  httpRequest.delete(`/roles/${id}`);
