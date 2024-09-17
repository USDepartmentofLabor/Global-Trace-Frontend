declare namespace CAP {
  import {
    TimePeriodEnum,
    RequestExtensionStatusEnum,
    CapStatusEnum,
  } from 'enums/brand';
  import { LevelRiskCategoryEnum } from 'enums/saq';

  export type CAPParams = {
    subIndicatorId?: string;
    action?: string;
    targetCompletionAt?: number;
    files?: File[];
    riskScoreLevel?: string;
    status?: CapStatusEnum;
    deleteBlobNames?: string[];
  };

  export type CommentParams = {
    files?: File[];
    content: string;
    deleteBlobNames?: string[];
  };

  export type Comment = {
    id: string;
    createdAt: number;
    content: string;
    files: App.FileResponse[];
    user: Auth.User;
    userId: string;
    deleteBlobNames?: string[];
  };

  export type CAP = {
    id: string;
    status: CapStatusEnum;
    targetCompletionAt: number;
    action: string;
    updatedAt: number;
    createdFacility: Auth.Facility;
    createdFacilityId: string;
    facility: Auth.Facility;
    facilityId: string;
    riskScoreLevel: LevelRiskCategoryEnum;
    files: App.FileResponse[];
    comments: Comment[];
    isOwner: boolean;
    requestExtensions: RequestExtension[];
  };

  export type RequestExtension = {
    id: string;
    capId: string;
    status: RequestExtensionStatusEnum;
    timePeriod: TimePeriodEnum;
    targetCompletionAt: number;
    createdAt: number;
  };

  export type CAPDetail = {
    indicator: Auth.Indicator;
    risk: Auth.Risk;
    indicatorRiskData: IndicatorRiskData;
  };

  export type IndicatorRiskData = {
    indicator: Indicator;
    risk: Risk;
    subIndicatorRiskData: Auth.SubIndicatorRiskData;
  };

  export type RequestParams = {
    page?: number;
    perPage?: number;
    sortFields?: string;
  };

  export type RequestExtensionParams = {
    timePeriod: TimePeriodEnum;
  };
}
