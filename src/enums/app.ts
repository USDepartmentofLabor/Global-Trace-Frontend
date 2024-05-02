export enum SortType {
  DESC = 'desc',
  ASC = 'asc',
}

export enum StatusCode {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  TooManyRequests = 429,
  InternalServerError = 500,
}

export enum ButtonType {
  BUTTON = 'button',
  SUBMIT = 'submit',
}

export enum InputType {
  TEXT = 'text',
  NUMBER = 'number',
  PASSWORD = 'password',
  TEXTAREA = 'textarea',
  RADIO = 'radio',
}

export enum DateTimeViewType {
  DAY = 'day',
  MONTH = 'month',
}

export enum SidebarType {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

export enum TrashContentEnum {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum SupplierViewModeEnum {
  LIST = 'list',
  CATEGORY = 'category',
}

export enum MapViewType {
  DEFAULT = 'default',
  EXPORT_PDF = 'export_pdf',
}

export enum TransactionTypeEnum {
  PURCHASE = 1,
  SELL = 2,
  TRANSPORT = 3,
  TRANSFORM = 4,
  RECORD_PRODUCT = 5,
}

export enum ChangeStepEnum {
  NEXT = 'Next',
  BACK = 'Back',
}

export enum SelectPanelEnum {
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
}

export enum UploadType {
  PRODUCT = 'product',
  ATTRIBUTE = 'attribute',
}

export enum ServiceContentEnum {
  TERM = 'term',
  POLICY = 'policy',
}
