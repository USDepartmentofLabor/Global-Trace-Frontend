declare namespace RiskAssessmentManagement {
  import { MethodologyEnum } from 'enums/risk-assessment';

  export interface RiskAssessment {
    id: string;
    methodology: MethodologyEnum;
    geographyWeight: number;
    saqsWeight: number;
    dnaWeight: number;
    roleWeights: RoleWeight[];
  }

  export type RiskAssessmentParams = {
    methodology?: MethodologyEnum;
    geographyWeight: number;
    listOfGoodsWeight: number;
    saqsWeight: number;
    capWeight: number;
    dnaWeight: number;
    hotlineWeight: number;
    roleWeights: RoleWeight[];
  };

  export type RoleWeight = {
    roleId: string;
    weight: number;
  };

  export type RiskAssessmentProperties = {
    hasDNA: boolean;
    hasSAQ: boolean;
    hasCAP: boolean;
    hasHotline: boolean;
  };
}
