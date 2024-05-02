declare namespace BrandProduct {
  export interface Order {
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    purchaseOrderNumber: string;
    purchasedAt?: number;
    productDescription?: string;
    quantity?: string;
    invoiceNumber: string;
    packingListNumber: string;
    creatorId?: string;
    facilityId?: string;
    supplierId: string;
    supplier?: Auth.Facility;
  }
}
