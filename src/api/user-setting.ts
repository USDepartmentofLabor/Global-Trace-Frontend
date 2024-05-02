import httpRequest from './http-request';

export const changePassword = (
  data: AdminSetting.ChangePasswordParams,
): Promise<void> => httpRequest.put('/users/change-password', data);

export const getUserInfo = (): Promise<Auth.User> =>
  httpRequest.get('/users/me');

export const updateProfile = (params: Onboard.ProfileFormData): Promise<void> =>
  httpRequest.put('/users', params);

export const getCommodities = (): Promise<string[]> =>
  httpRequest.get('/business-details/selected-commodities');

export const deleteMyAccount = (): Promise<void> =>
  httpRequest.delete('/users/me');
