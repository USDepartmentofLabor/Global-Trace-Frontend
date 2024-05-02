declare namespace DNAManagement {
  export interface DNA {
    id: string;
    requestFacilityId: string;
    requestFacility?: Auth.Facility;
    productSupplierId: string;
    productSupplier?: Auth.Facility;
    productId: string;
    testedAt: number;
    status: number;
    dnaIdentifier: string;
    uploadProofs: UploadProof[];
  }

  export type UploadProof = {
    fileName: string;
    link: string;
  };

  export type CreateDNATestParams = {
    requestFacilityId: string;
    productSupplierId: string;
    productId: string;
    testedAt: number;
    isDetected: boolean;
    dnaIdentifiers: string[];
    uploadProofs: File[];
  };
}
