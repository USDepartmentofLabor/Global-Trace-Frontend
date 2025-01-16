import { isArray } from 'lodash';
import moment from 'moment';
import { InputAttributeEnum } from 'enums/app';
import { ProductAttributeTypeEnum } from 'enums/product';
import { DEFAULT_LANGUAGE } from 'config/constants';
import AppModule from 'store/modules/app';
import { translate } from './helpers';
import { formatDate } from './date';

export const hasUrduCharacter = (value: string): boolean => {
  const regex = /[\u0600-\u06FF]/gm;
  return regex.test(value);
};

export function convertEnumToTranslation(value: string): string {
  return value ? value.replaceAll(/\W/g, '_').toLowerCase() : '';
}

export function getInputCategoryName(type: InputAttributeEnum): string {
  switch (type) {
    case InputAttributeEnum.UNIQUE_ID:
      return translate('unique_id');
    case InputAttributeEnum.ATTACHMENTS:
      return translate('file_and_attachment');
    case InputAttributeEnum.COUNTRY_PROVINCE_DISTRICT:
      return translate('country_province_district');
    case InputAttributeEnum.DATE:
      return translate('date');
    case InputAttributeEnum.LIST:
      return translate('list');
    case InputAttributeEnum.NUMBER:
      return translate('number');
    case InputAttributeEnum.NUMBER_UNIT_PAIR:
      return translate('number_unit_pair');
    case InputAttributeEnum.PERCENTAGE:
      return translate('percentage');
    case InputAttributeEnum.TEXT:
      return translate('text');
    case InputAttributeEnum.COUNTRY:
      return translate('country');
    case InputAttributeEnum.PROVINCE:
      return translate('province');
    case InputAttributeEnum.DISTRICT:
      return translate('district');
  }
}

/* eslint-disable max-params */
export function getProductValue(
  value: string | string[],
  quantityUnit: string,
  attributeName: string,
  type: InputAttributeEnum,
): string {
  switch (type) {
    case InputAttributeEnum.ATTACHMENTS:
    case InputAttributeEnum.COUNTRY_PROVINCE_DISTRICT:
      return '';
    case InputAttributeEnum.DATE: {
      const date = formatDate(moment(value).unix());
      return `${attributeName}: ${date}`;
    }
    case InputAttributeEnum.LIST: {
      const list = isArray(value) ? (value as string[]).join(',') : value;
      return `${attributeName}: ${list}`;
    }
    case InputAttributeEnum.PERCENTAGE:
      return `${attributeName}: ${value}%`;
    case InputAttributeEnum.NUMBER_UNIT_PAIR:
      return `${attributeName}: ${value} ${quantityUnit}`;
    case InputAttributeEnum.NUMBER:
    case InputAttributeEnum.TEXT:
      return `${attributeName}: ${value}`;
  }
}

export function getProductAttributeTypeName(
  type: ProductAttributeTypeEnum,
): string {
  switch (type) {
    case ProductAttributeTypeEnum.PRODUCT_ID:
      return translate('product_id');
    case ProductAttributeTypeEnum.PRODUCT_QUANTITY:
      return translate('product_quantity');
    case ProductAttributeTypeEnum.OTHER:
      return translate('other');
  }
}

export function getCategoryName(
  name: string,
  translation: {
    [x: string]: string;
  },
): string {
  const currentLocale = AppModule.locale;
  return currentLocale === DEFAULT_LANGUAGE
    ? name
    : translation?.[currentLocale] || name;
}
