declare namespace PartnerManagement {
  export type RequestParams = {
    page?: number;
    perPage?: number;
    sortFields?: string;
  };

  export interface Partner {
    id: string;
    name: string;
    type: number;
    oarId: string;
    users: Auth.User[];
  }
}
