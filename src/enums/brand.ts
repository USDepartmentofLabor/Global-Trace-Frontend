export enum YesNoEnum {
  YES = 'yes',
  NO = 'no',
}

export enum RiskScoreTypeEnum {
  LABOUR_RISK_LEVEL = 'laborRiskLevel',
  TRACEABILITY_RISK_LEVEL = 'traceabilityRiskLevel',
}

export enum RiskAssessmentGroupEnum {
  PRODUCTION_INFORMATION = 'Production Information',
  LABOR_INFORMATION = 'Labor Information',
}

export enum FilterKeysEnum {
  Source = 'Source',
  DateRange = 'Date range',
  Category = 'Category',
  Indicator = 'Indicator',
  SubIndicator = 'SubIndicator',
}

export enum RiskPreviewTypeEnum {
  SUPPLIER_DETAIL = 'SUPPLIER_DETAIL',
  PDF = 'PDF',
  ACTION_PLAN = 'ACTION_PLAN',
}

export enum CapStatusEnum {
  NEW = 'New',
  IN_PROGRESS = 'In progress',
  UNDER_REVIEW = 'Under review',
  RESOLVED = 'Resolved',
  DRAFT = 'Draft',
  OVERDUE = 'Overdue',
}

export enum ActionPlanViewEnum {
  ACTION_PLAN = 'Corrective Action Plan',
  ACCEPT_EVIDENCE = 'Accept evidence',
}

export enum SupplierDetailTabEnum {
  GENERAL_INFORMATION = 'GENERAL_INFORMATION',
  COMPLIANCE_HISTORY = 'Compliance History',
}

export enum SubIndicatorRiskEnum {
  CAP = 'CAP',
  PRODUCT_RISK_LISTINGS = 'Product risk listings',
}

export enum TimePeriodEnum {
  ONE_WEEK = '1w',
  TWO_WEEKS = '2w',
  ONE_MONTH = '1m',
  TWO_MONTHS = '2m',
  SIX_MONTHS = '6m',
  TWELVE_MONTHS = '12m',
}

export enum RequestExtensionStatusEnum {
  APPROVED = 'Approved',
  PENDING = 'Pending',
  DECLINE = 'Decline',
}
