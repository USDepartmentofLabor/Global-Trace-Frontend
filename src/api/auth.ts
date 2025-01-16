import httpRequest from './http-request';

export const signIn = async (
  params: Auth.UserCertificate,
): Promise<Auth.UserAuthentication> =>
  httpRequest.post<Auth.UserCertificate, Auth.UserAuthentication>(
    '/auth/login',
    params,
  );

export const getFacilityTypes = (): Promise<RoleAndPermission.Role[]> =>
  httpRequest.get('/roles/administrator-completes-profile');

export const getUserInvite = (token: string): Promise<Auth.User> =>
  httpRequest.get(`/auth/invite/${token}`);

export const getShortToken = (): Promise<Auth.ShortToken> =>
  httpRequest.post('/auth/short-token');

export const signUp = (params: Auth.UserRegistration): Promise<void> =>
  httpRequest.post(`/auth/signup`, params);

export const logOut = (): Promise<void> => httpRequest.delete('/auth/logout');
