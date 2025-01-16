import httpRequest from './http-request';

export const createUser = (data: UserManagement.User): Promise<void> =>
  httpRequest.post('/users/invite', data);

export const updateUser = (
  id: string,
  data: UserManagement.UserRequestParams,
): Promise<void> => httpRequest.put(`/users/${id}`, data);

export const getUserList = (
  params: UserManagement.RequestParams,
): Promise<App.ListItem<Auth.User>> => httpRequest.get('/users', { params });

export const deleteUser = (userId: string): Promise<void> =>
  httpRequest.delete(`/users/${userId}`);

export const resendInvitation = (userId: string): Promise<void> =>
  httpRequest.post(`/users/${userId}/resend-invitation`);
