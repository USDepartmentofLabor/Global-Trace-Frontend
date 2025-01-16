export enum PermissionGroupEnum {
  LABOR_RISK = 'LABOR_RISK',
  PRODUCT_TRACING = 'PRODUCT_TRACING',
  OTHERS = 'OTHERS',
}

export enum PermissionActionEnum {
  ONBOARDING = 'ONBOARDING',
  COMPLETE_OWN_PROFILE = 'COMPLETE_OWN_PROFILE',
  ADMINISTRATOR_COMPLETES_PROFILE = 'ADMINISTRATOR_COMPLETES_PROFILE',
  COMPLETE_OWN_SAQ = 'COMPLETE_OWN_SAQ',
  ADMINISTRATOR_COMPLETES_SAQ = 'ADMINISTRATOR_COMPLETES_SAQ',
  NO_SAQ = 'NO_SAQ',

  INVITE_PARTNERS = 'INVITE_PARTNERS',

  LOG_PURCHASE = 'LOG_PURCHASE',
  INPUT_PRODUCT_ID_IN_PURCHASE = 'INPUT_PRODUCT_ID_IN_PURCHASE',
  SCAN_QR_CODE_IN_PURCHASE = 'SCAN_QR_CODE_IN_PURCHASE',
  MANUALLY_DEFINE_NEW_PRODUCT = 'MANUALLY_DEFINE_NEW_PRODUCT',
  ALLOW_PURCHASE_INTERMEDIARIES = 'ALLOW_PURCHASE_INTERMEDIARIES',

  LOG_TRANSFORMATIONS = 'LOG_TRANSFORMATIONS',
  ASSIGN_PRODUCT_ID = 'ASSIGN_PRODUCT_ID',
  ASSIGN_QR_CODE = 'ASSIGN_QR_CODE',
  ASSIGN_DNA = 'ASSIGN_DNA',

  LOG_SALE = 'LOG_SALE',
  INPUT_PRODUCT_ID_IN_SALE = 'INPUT_PRODUCT_ID_IN_SALE',
  SCAN_QR_CODE_IN_SALE = 'SCAN_QR_CODE_IN_SALE',
  ALLOW_SALE_INTERMEDIARIES = 'ALLOW_SALE_INTERMEDIARIES',

  LOG_BY_PRODUCT = 'LOG_BY_PRODUCT',

  LOG_TRANSPORT = 'LOG_TRANSPORT',
  INPUT_PRODUCT_ID_IN_TRANSPORT = 'INPUT_PRODUCT_ID_IN_TRANSPORT',
  SCAN_QR_CODE_IN_TRANSPORT = 'SCAN_QR_CODE_IN_TRANSPORT',

  VIEW_HISTORY = 'VIEW_HISTORY',
  VIEW_MARGIN_OF_ERROR = 'VIEW_MARGIN_OF_ERROR',

  SUBMIT_REPORTS = 'SUBMIT_REPORTS',
  PROACTIVE_ASSESSMENTS = 'PROACTIVE_ASSESSMENTS',
  REACTIVE_ASSESSMENTS = 'REACTIVE_ASSESSMENTS',

  VIEW_REPORTS = 'VIEW_REPORTS',
  VIEW_ONLY_MY_REPORTS = 'VIEW_ONLY_MY_REPORTS',
  VIEW_ALL_REPORTS = 'VIEW_ALL_REPORTS',

  DNA = 'DNA',
  VIEW_DNA_TEST_RESULTS = 'VIEW_DNA_TEST_RESULTS',
  LOG_DNA_TEST_RESULTS = 'LOG_DNA_TEST_RESULTS',

  GENERATE_QR_CODES = 'GENERATE_QR_CODES',

  SUBMIT_GRIEVANCE_REPORTS = 'SUBMIT_GRIEVANCE_REPORTS',
  REFER_REPORT_FOR_FOLLOW_UP = 'REFER_REPORT_FOR_FOLLOW_UP',

  USER_MANAGEMENT = 'USER_MANAGEMENT',
  VIEW_SUPPLIER_RISK_ASSESSMENT_IN_USER_MANAGEMENT = 'VIEW_SUPPLIER_RISK_ASSESSMENT_IN_USER_MANAGEMENT',

  VIEW_SUPPLIER_RISK_ASSESSMENT = 'VIEW_SUPPLIER_RISK_ASSESSMENT',

  TRACE_PRODUCT = 'TRACE_PRODUCT',

  SUPPLIER_MANAGEMENT = 'SUPPLIER_MANAGEMENT',
  VIEW_SUPPLIER_RISK_ASSESSMENT_IN_SUPPLIER_MANAGEMENT = 'VIEW_SUPPLIER_RISK_ASSESSMENT_IN_SUPPLIER_MANAGEMENT',

  CAP = 'CAP',
  ASSIGN_CAP = 'ASSIGN_CAP',
  VIEW_CAP = 'VIEW_CAP',

  SUBMIT_INCIDENT_REPORT_VIA_API = 'SUBMIT_INCIDENT_REPORT_VIA_API',
  PROACTIVE_ASSESSMENTS_VIA_API = 'PROACTIVE_ASSESSMENTS_VIA_API',
  REACTIVE_ASSESSMENTS_VIA_API = 'REACTIVE_ASSESSMENTS_VIA_API',

  GET_INCIDENT_REPORT_VIA_API = 'GET_INCIDENT_REPORT_VIA_API',

  CREATE_NEW_RISK_INDEX = 'CREATE_NEW_RISK_INDEX',
  EDIT_EXISTING_RISK_INDEX = 'EDIT_EXISTING_RISK_INDEX',

  CREATE_NEW_INDICATOR_LIST = 'CREATE_NEW_INDICATOR_LIST',
  EDIT_EXISTING_INDICATOR_LIST = 'EDIT_EXISTING_INDICATOR_LIST',
}

export enum ChainOfCustodyEnum {
  PRODUCT_SEGREGATION = 'Product Segregation',
  MASS_BALANCE = 'Mass balance',
}

export enum RoleTypeEnum {
  PRODUCT = 'Producer',
  LABOR = 'Assessor',
  ADMINISTRATOR = 'Administrator',
  BRAND = 'Brand',
  API_USER = 'API user',
}

export enum GroupTypeEnum {
  RADIO_MULTIPLE_GROUP = 'RADIO_MULTIPLE_GROUP',
  CHECKBOX_GROUP = 'CHECKBOX_GROUP',
  CHECKBOX = 'CHECKBOX',
  RADIO_GROUP = 'RADIO_GROUP',
}

export enum RoleStepEnum {
  INFO = 'ROLE_INFO',
  PERMISSION = 'ROLE_PERMISSION',
  ATTRIBUTE = 'ATTRIBUTE',
  ADD_ADDITIONAL_ATTRIBUTE = 'ADD_ADDITIONAL_ATTRIBUTE',
  ATTRIBUTE_SETTING = 'ATTRIBUTE_SETTING',
}

export enum RoleAttributeTypeEnum {
  OPEN_SUPPLY_HUB_ID = 'Open Supply Hub ID',
  RMI_CID = 'Responsible Minerals Initiative RMAP ID',
  DUNS_ID = 'D-U-N-S ID',
  INTERNAL_INDENTIFIER_SYSTEM = 'Internal Identifier system',
  ADDITIONAL_ATTRIBUTE = 'Additional attributes',
}

export enum OSIDAttributesEnum {
  OS_ID = 'OS ID',
  BUSINESS_NAME = 'Business Name',
  COUNTRY = 'Country',
  PROVINCE = 'Province/State',
  DISTRICT = 'District',
  ADDRESS = 'Address',
}

export enum CIDAttributesEnum {
  FACILITY_ID = 'Facility ID',
  METAL = 'Metal',
  FACILITY_NAME = 'Facility name',
  COUNTRY = 'Country location',
  PROVINCE = 'Province/State',
  DISTRICT = 'District',
  ADDRESS = 'State/Province/Region',
}
