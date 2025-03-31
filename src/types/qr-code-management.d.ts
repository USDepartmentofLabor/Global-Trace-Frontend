declare namespace QRCodeManagement {
  export interface QRCode {
    id: string;
    name: string;
    quantity: number;
    totalActive: number;
    totalDispensed: number;
    totalEncoded: number;
    completedAt: number;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
    creator: Auth.User;
    creatorId: string;
  }

  export type QRCodeRequestParams = {
    name: string;
    quantity: number;
  };

  export type GetListRequestParams = {
    key?: string;
    page?: number;
    perPage?: number;
    sortFields?: string;
  };
}
