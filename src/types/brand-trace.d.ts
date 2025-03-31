declare namespace BrandTrace {
  export type OrderSupplierRequestParams = {
    orderId?: string;
    supplierId?: string;
    orderSupplierId?: string;
    parentId: string;
    purchasedAt: number;
    purchaseOrderNumber?: string;
    invoiceNumber?: string;
    packingListNumber?: string;
  };

  export interface OrderSupplier {
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    orderId?: string;
    supplierId: string;
    parentId: string;
    purchasedAt: number;
    purchaseOrderNumber?: string;
    invoiceNumber?: string;
    packingListNumber?: string;
    fromSupplierId?: string;
  }

  export interface OrderDetail {
    id: string;
    purchaseOrderNumber: string;
    purchasedAt: number;
    productDescription: string;
    quantity: string;
    invoiceNumber: string;
    packingListNumber: string;
    supplier: Auth.Facility;
  }
}
