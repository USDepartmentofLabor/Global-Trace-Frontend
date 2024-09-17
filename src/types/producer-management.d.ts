declare namespace ProducerManagement {
  import { UserStatusEnum, ProducerTypeEnum } from 'enums/user';

  export type RequestParams = {
    page?: number;
    perPage?: number;
    sortFields?: string;
  };

  export interface User {
    firstName: string;
    lastName: string;
    email: string;
    status: UserStatusEnum;
    userType: UserStatusEnum;
  }

  export interface UserParams {
    firstName?: string;
    lastName?: string;
    email?: string;
    userType?: ProducerTypeEnum;
    status?: UserStatusEnum;
  }
}
