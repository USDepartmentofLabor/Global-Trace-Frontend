declare namespace AppStore {
  export interface AppState {
    locale: string;
  }

  export interface AuthState {
    isAuthenticated: boolean;
    user: Auth.User;
  }

  export interface RootState {
    app: AppState;
    auth: AuthState;
  }

  export interface UserManagementState {
    users: Auth.User[];
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
  }

  export interface Location {
    countries: Location.Country[];
  }

  export interface SellProductState {
    partnerPurchasers: SellProduct.PartnerPurchaser[];
  }

  export interface TransportState {
    partnerTransporters: Transport.PartnerTransporters[];
  }

  export interface TransformationState {
    currentOutputProduct: ProductManagement.Product;
  }

  export interface PurchaseState {
    partnerSellers: Purchase.PartnersSeller[];
  }

  export interface PartnerManagementState {
    partners: PartnerManagement.Partner[];
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
  }

  export interface GrievanceReportState {
    reports: GrievanceReport.Report[];
    indicators: GrievanceReport.Category[];
    reasons: GrievanceReport.Reason[];
    assignees: Auth.User[];
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
  }

  export interface AuditorRequestState {
    requests: GrievanceReport.Report[];
    indicators: GrievanceReport.Category[];
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
  }

  export interface RequestForAuditState {
    indicators: RequestForAudit.Indicator[];
  }

  export interface BrandProductOrderState {
    items: BrandProduct.Order[];
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
  }

  export interface BrandSupplierState {
    items: Supplier[];
    currentPage: number;
    total: number;
    lastPage: number;
    perPage: number;
    uploadedResponse: Files.UploadedFileResponse;
    uploadedFile: Files.UploadedFile;
  }

  export interface ImportFarmState {
    uploadedResponse: Files.UploadedFileResponse;
    uploadedFile: Files.UploadedFile;
  }

  export interface SAQState {
    groups: SAQ.SelfAssessmentGroup[];
    selfAssessment: SAQ.SelfAssessment;
    answers: SAQ.Answer[];
  }

  export interface ImportProductTranslationsState {
    uploadedProductsResponse: Files.UploadedFileResponse;
    uploadedAttributesResponse: Files.UploadedFileResponse;
  }

  export interface ProductState {
    products: ProductManagement.Product[];
    currentOutputProduct: ProductManagement.Product;
  }
}
