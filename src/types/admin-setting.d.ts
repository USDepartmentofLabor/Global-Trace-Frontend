declare namespace AdminSetting {
  export type ChangePasswordParams = {
    oldPassword: string;
    password?: string;
    newPassword: string;
  };
}
