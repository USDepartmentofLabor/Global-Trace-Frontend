declare namespace FacilityManagement {
  export type RequestParams = {
    roleId: string;
    page?: number;
    perPage?: number;
  };

  export type UploadFileParams = {
    roleId: string;
    facilityGroupId?: string;
    isUpdating: boolean;
  };

  export interface AdditionalInformation {
    id: string;
    createdAt: number;
    updatedAt: number;
    facilityId: string;
    farmGroupId: string;
    areas: Point[];
  }

  export type Point = {
    longitude: number;
    latitude: number;
  };

  export interface UpdateFacilityRequest {
    fileId: string;
    roleId: string;
    facilityGroupId?: string;
  }

  export type FilterParams = {
    sources?: string[];
    categoryIds?: string[];
    indicatorIds?: string[];
    subIndicatorIds?: string[];
    fromTime?: number;
    toTime?: number;
  };

  export type FilterValues = {
    sources: string[];
    categories: Auth.Category[];
    issues: Issue[];
    fromTime?: number;
    toTime?: number;
  };

  export type Issue = {
    indicator: Auth.Category;
    subIndicators: Auth.Category[];
  };
}
