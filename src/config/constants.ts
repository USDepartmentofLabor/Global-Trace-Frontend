import termEn from 'assets/data/term/en.txt';
import policyEn from 'assets/data/policy/en.txt';
import langEn from 'i18n/en.json';
import langUr from 'i18n/ur.json';
import RESOURCES from './resources';

export const DEFAULT_LANGUAGE = 'en';
export { langEn, langUr };
export const LOCALES = {
  EN: 'en',
  UR: 'ur',
};

export { RESOURCES };
export const PER_PAGE = '10';
export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm';
export const UNIT_PER_KG = 16000;
export const LBS_PER_KG = 0.45359237;
export const SIZE = 1024;

export const TIME_DEBOUCE = 300;
export const ENTER_KEY = 'Enter';

export const UPLOAD_EXCEL_FILE = {
  MAX_FILE: 1,
  MAX_SIZE: 10 * 1024 * 1024,
  EXTENSIONS: '.xls,.xlsx',
  ACCEPTED:
    '.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

export const UPLOAD_FILE = {
  MAX_SIZE: 10 * 1024 * 1024,
  EXTENSIONS: 'png,jpeg,jpg,pdf',
  ACCEPTED: 'image/png,image/jpeg,image/jpg,application/pdf',
};

export const UPLOAD_LOGO = {
  MAX_SIZE: 10 * 1024 * 1024,
  EXTENSIONS: 'png,jpeg,jpg,bmp,heic,heif,gif',
  ACCEPTED:
    'image/png,image/jpeg,image/jpg,image/bmp,image/heic,image/heif,image/gif',
};

export const UPLOAD_TRANSLATE = {
  MAX_SIZE: 10 * 1024 * 1024,
  EXTENSIONS: 'JSON',
  ACCEPTED: 'application/JSON',
};

export const SCAN_QR_CODE_CONFIG = {
  fps: 10,
  qrbox: 300,
};

export const PAGINATION_DEFAULT = {
  total: 1,
  lastPage: 1,
  perPage: 20,
  currentPage: 1,
};

export const MAP_VIEW: App.MapViewConstant = {
  WIDTH: 1160,
  BLOCK_WIDTH: 160,
  BLOCK_HEIGHT: 70,
  COLUMN_SPACE: 90,
  ROW_SPACE: 22,
};

export const TRACE_MAP_VIEW: App.MapViewConstant = {
  WIDTH: 1160,
  BLOCK_WIDTH: 160,
  BLOCK_HEIGHT: 92,
  COLUMN_SPACE: 90,
  ROW_SPACE: 22,
};

export const ONE_TIER_MAP_VIEW: App.MapViewConstant = {
  WIDTH: 160,
  BLOCK_WIDTH: 160,
  BLOCK_HEIGHT: 70,
  COLUMN_SPACE: 90,
  ROW_SPACE: 22,
};

export const PRODUCT_TRACING_MAP_VIEW: App.MapViewConstant = {
  WIDTH: 750,
  BLOCK_WIDTH: 130,
  BLOCK_HEIGHT: 50,
  COLUMN_SPACE: 25,
  ROW_SPACE: 16,
};

export const OTHER_COUNTRY_ID = '70beea98-e08c-4ba3-800c-d20bb6fa7247';
export const OTHER_PROVINCE_ID = '46d0173c-c5b5-451e-8d2e-8cfc6bad3e0f';
export const OTHER_DISTRICT_ID = '1bba9e49-0700-4178-bf67-17b20c0ca5db';
export const PAKISTAN = 'Pakistan';
export const NO_TRACEABILITY_DATA = 0;

export const RISK_KEY = {
  LABOR_RISK_LEVEL: 'laborRiskLevel',
  PRODUCT_RISK_LEVEL: 'productRiskLevel',
};

export const START_ORDER = 1;

export const YES_NO_COLOR = {
  YES: 'red',
  NO: 'ghost',
};

export const NODE_WIDTH = {
  BIG: 200,
  MEDIUM: 160,
};

export const NODE_HEIGHT = {
  BIG: 92,
  MEDIUM: 67,
};

export const NODE_SPACE = 50;

export const INVALID_DATE = 'Invalid date';

export const SUPPLIER_MAP_CONFIG = {
  TYPE: 'basic',
  DIRECTION: 'right',
};

export const TERM = {
  en: termEn,
};

export const POLICY = {
  en: policyEn,
};
