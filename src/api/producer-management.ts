import httpRequest from './http-request';

export const createUser = (
  data: ProducerManagement.UserParams,
): Promise<void> => httpRequest.post('/user-managements', data);

export const updateUser = (
  id: string,
  data: ProducerManagement.UserParams,
): Promise<void> => httpRequest.put(`/user-managements/${id}`, data);

export const getUserList = (
  params: ProducerManagement.RequestParams,
): Promise<App.ListItem<Auth.User>> =>
  httpRequest.get('/user-managements', { params });

export const deleteUser = (userId: string): Promise<void> =>
  httpRequest.delete(`/user-managements/${userId}`);

export const resendInvitation = (userId: string): Promise<void> =>
  httpRequest.post(`/user-managements/${userId}/resend-invitation`);
