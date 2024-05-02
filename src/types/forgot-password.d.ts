declare namespace ForgotPassword {
  export type RequestPassword = {
    email: string;
  };

  export type ResetPassword = {
    token?: string;
    password: string;
  };

  export type ResetPasswordParams = {
    token?: string;
    password: string;
  };

  export type VerifyToken = {
    token: string;
  };
}
