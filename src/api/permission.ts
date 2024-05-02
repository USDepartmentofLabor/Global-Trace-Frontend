import httpRequest from './http-request';

export const getPermissions = (
  params: RoleAndPermission.RoleTypeParams,
): Promise<RoleAndPermission.NewPermission[]> =>
  httpRequest.get('/permissions', { params });

export const createRole = (
  params: RoleAndPermission.RoleParams,
): Promise<void> => httpRequest.post('/roles', params);

export const editRole = (
  id: string,
  params: RoleAndPermission.RoleParams,
): Promise<void> => httpRequest.put(`/roles/${id}`, params);

export const validateRoles = (
  params: RoleAndPermission.RoleValidateParams,
): Promise<void> => httpRequest.post('/roles/validate-roles', params);
