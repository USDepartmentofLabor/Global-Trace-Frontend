import { isArray } from 'lodash';
import moment from 'moment';
import { ProductAttributeEnum, ProductAttributeTypeEnum } from 'enums/product';
import { translate } from './helpers';
import { formatDate } from './date';

export function convertEnumToTranslation(value: string): string {
  return value ? value.replaceAll(/\W/g, '_').toLowerCase() : '';
}

export function getProductCategoryName(type: ProductAttributeEnum): string {
  switch (type) {
    case ProductAttributeEnum.ATTACHMENTS:
      return translate('file_and_attachment');
    case ProductAttributeEnum.COUNTRY_PROVINCE_DISTRICT:
      return translate('country_province_district');
    case ProductAttributeEnum.DATE:
      return translate('date');
    case ProductAttributeEnum.LIST:
      return translate('list');
    case ProductAttributeEnum.NUMBER:
      return translate('number');
    case ProductAttributeEnum.NUMBER_UNIT_PAIR:
      return translate('number_unit_pair');
    case ProductAttributeEnum.PERCENTAGE:
      return translate('percentage');
    case ProductAttributeEnum.TEXT:
      return translate('text');
  }
}

/* eslint-disable max-params */
export function getProductValue(
  value: string | string[],
  quantityUnit: string,
  attributeName: string,
  type: ProductAttributeEnum,
): string {
  switch (type) {
    case ProductAttributeEnum.ATTACHMENTS:
    case ProductAttributeEnum.COUNTRY_PROVINCE_DISTRICT:
      return '';
    case ProductAttributeEnum.DATE: {
      const date = formatDate(moment(value).unix());
      return `${attributeName}: ${date}`;
    }
    case ProductAttributeEnum.LIST: {
      const list = isArray(value) ? (value as string[]).join(',') : value;
      return `${attributeName}: ${list}`;
    }
    case ProductAttributeEnum.PERCENTAGE:
      return `${attributeName}: ${value}%`;
    case ProductAttributeEnum.NUMBER_UNIT_PAIR:
      return `${attributeName}: ${value} ${quantityUnit}`;
    case ProductAttributeEnum.NUMBER:
    case ProductAttributeEnum.TEXT:
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
