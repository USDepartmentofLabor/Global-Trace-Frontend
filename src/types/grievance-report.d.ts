declare namespace GrievanceReport {
  import { CategoryEnum, PriorityEnum } from 'enums/auditor';
  export interface Report {
    id: string;
    facilityId?: string;
    facility?: Auth.Facility;
    creator?: Auth.User;
    assigneeId?: string;
    assignee?: Auth.User;
    indicator: string;
    location?: string;
    isResponded?: boolean;
    responses?: Response[];
    ComplianceHistory?: ComplianceHistory[];
    reason?: string;
    message?: string;
    createdAt?: number;
    updatedAt?: number;
    severity?: string;
    uploadImages?: string[];
    recordedAt?: number;
    latestActivityAt?: number;
    isNoFollowUp?: boolean;
    status?: PriorityEnum;
    priority?: PriorityEnum;
    laborRisks?: LaborRisk[];
  }

  export type Response = {
    id: string;
    severity: string;
    indicator: string;
    recordedAt: number;
    message: string;
    auditReportNumber?: string;
    uploadImages?: string[];
    createdAt?: number;
    recordedAt?: number;
    updatedAt?: number;
    grievanceReportId?: string;
    uploadImages?: string[];
    laborRisks?: LaborRisk[] | string;
  };

  export type ComplianceHistory = {
    indicator?: Category;
    subIndicator?: Category;
    comments: Comment[];
  };

  export type Comment = {
    id: string;
    message: string;
    severity: number;
    createdAt: number;
  };

  export type ResponseRequestParams = {
    indicator: string;
    recordedAt: number;
    message: string;
    auditReportNumber: string;
    uploadImages?: File[] | string[];
    laborRisks: LaborRisk[] | string;
    priority: PriorityEnum;
  };

  export type CommunityRiskScanParams = {
    facilityId: string;
    location: string;
    recordedAt: number;
    priority: PriorityEnum;
    message: string;
    uploadFiles?: File[] | string[];
    laborRisks: LaborRisk[] | string;
  };

  export type LaborRisk = {
    indicatorId: string;
    indicator?: Category;
    subIndicatorId: string;
    subIndicator?: Category;
    severity: number;
  };

  export type IndicatorsFilterParams = {
    indicator: SortType;
    subIndicator: SortType;
    severity: SortType;
  };

  export type LaborRiskParams = {
    indicator: App.DropdownOption;
    subIndicator: App.DropdownOption;
    severity: App.DropdownOption;
  };

  export type RequestParams = {
    key?: string;
    page?: number;
    perPage?: number;
    sortFields?: string;
  };

  export type Category = {
    id: string;
    name: string;
  };

  export type CategoryParams = {
    type: CategoryEnum;
    parentId?: string;
  };

  export type Reason = {
    id: string;
    name: string;
  };

  export type Facility = {
    id: string;
    name: string;
  };

  export type CreateReportParams = {
    facilityId: string;
    location: string;
    message: string;
    assigneeId?: string;
    reason?: string;
    isNoFollowUp?: boolean;
    priority: PriorityEnum;
    laborRisks: LaborRisk[] | string;
  };

  export type EditReportParams = {
    indicator: string;
    assigneeId?: string;
    reason?: string;
    isNoFollowUp?: boolean;
    priority: PriorityEnum;
    laborRisks: LaborRisk[] | string;
  };
}
