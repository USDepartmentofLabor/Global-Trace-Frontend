import httpRequest from './http-request';

export const requestPassword = (
  data: ForgotPassword.RequestPassword,
): Promise<void> => httpRequest.post('/reset-password', data);

export const resetPassword = (
  data: ForgotPassword.ResetPassword,
): Promise<void> => httpRequest.put('/reset-password', data);

export const verifyToken = (data: ForgotPassword.VerifyToken): Promise<void> =>
  httpRequest.post('/reset-password/check-token', data);
