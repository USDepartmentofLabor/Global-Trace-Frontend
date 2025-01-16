declare namespace SAQ {
  import { SAQTypesEnum, OptionTypeEnum, GoToTypeEnum } from 'enums/saq';
  import { RiskScoreTypeEnum } from 'enums/brand';
  import { SeverityEnum, RiskScoreLevelEnum } from 'enums/auditor';

  export type SAQData = {
    groups: SelfAssessmentGroup[];
    selfAssessment: SelfAssessment;
  };

  export type SelfAssessment = {
    id: string;
    forFacilityId: string;
    totalDraftAnswers: number;
    totalQuestions: number;
    incompleteQuestions?: SelfAssessmentQuestion[];
    onGoingAnswerAtGroupId?: string;
    onGoingAnswerAtQuestionId?: string;
    createAt?: number;
    updatedAt?: number;
    completedSaqAt?: number;
  };

  export type SelfAssessmentGroup = {
    id?: string;
    title: App.Any;
    order: number;
    forRoles?: string;
    questions: SelfAssessmentQuestion[];
    conditionalQuestions: SelfAssessmentQuestion[];
    createAt?: number;
    updatedAt?: number;
  };

  export type RiskScore = {
    id: string;
    type: RiskScoreTypeEnum;
    level: SeverityEnum;
    createAt: number;
    updatedAt: number;
    selfAssessmentId: string;
    groupId: string;
    riskScore: number;
    group: SelfAssessmentGroup;
  };

  export type SelfAssessmentQuestion = {
    id?: string;
    order: number;
    selfAssessmentGroupId?: string;
    title: {
      [x: string]: string;
    };
    description?: App.Any;
    type: SAQTypesEnum;
    typeIndex?: number;
    isRequired: boolean;
    createAt?: number;
    updatedAt?: number;
    part: App.Any;
    isShow?: boolean;
    questionResponses: QuestionResponse[];
  };

  export type QuestionResponse = {
    createdAt: number;
    updatedAt: number;
    goTo: number;
    goToType: GoToTypeEnum;
    id: string;
    indicatorId: string;
    nextQuestionId: string;
    option: string;
    optionType: OptionTypeEnum;
    riskLevel: RiskScoreLevelEnum;
    riskScore?: number;
    selfAssessmentQuestionId: string;
    subIndicatorId: string;
    translation: {
      [x: string]: string;
    };
  };

  export interface SelfAssessmentAnswer {
    id: string;
    groupId: string;
    selfAssessmentQuestionId: string;
    answers: SelfAssessmentAnswerValue[];
  }

  export type SelfAssessmentAnswerValue = {
    value: string;
    questionResponse: QuestionResponse;
  };

  export type AnswerParams = {
    answers: Answer[];
  };

  export type Answer = {
    selfAssessmentQuestionId: string;
    answerValues: AnswerValues[];
  };

  export type AnswerValues = {
    value: string;
    isOther?: boolean;
    selfAssessmentQuestionResponseId: string;
  };

  export type AnswerValue = {
    answerValueValidateSchema: AnswerValueValidateSchema;
    label: string;
    placeholder: string;
  };

  export type AnswerValueValidateSchema = {
    rule: string;
  };

  export type ResponseCheckbox = {
    code: string;
    i18n: Distionary<string>;
    skipAllSelected?: boolean;
    placeholder?: string;
    laborRiskLevel?: string;
    laborRiskType?: string;
    traceabilityRiskLevel?: string;
  };

  export type IncompleteQuestion = {
    questionNumber: number | string;
    part: string;
  };

  export type QuestionGroup = {
    questionNumbers: string[] | number[];
    part: string;
  };

  export interface ConfigurableSAQ {
    id: string;
    name: string;
    status: Status;
    hasFacilityGroupTemplate: boolean;
    fileSaq: File;
    fileFacilityGroupTemplate: File;
  }

  export type Status = {
    saqStatus: string;
    saqTranslationStatus: string;
  };

  export type File = {
    fileName: string;
    link: string;
  };

  export interface ImportParams {
    fileSaq: Files.UploadedFileParam;
    fileFacilityGroupTemplate?: Files.UploadedFileParam;
    roleId: string;
  }

  export interface TranslationParams {
    file: Files.UploadedFileParam;
    roleId: string;
  }

  export type UploadedFileResponse = {
    validationErrors?: ValidationError[];
  };
}
