import {
  every,
  find,
  get,
  has,
  includes,
  isEmpty,
  isNull,
  sumBy,
} from 'lodash';
import AppModule from 'store/modules/app';
import {
  AvailableWeightUnit,
  ProductAttributeTypeEnum,
  TransactionLevel,
} from 'enums/product';
import { InputAttributeEnum } from 'enums/app';
import { convertUnitToKg, translate } from './helpers';

// eslint-disable-next-line max-lines-per-function
export function validProduct(
  attributes: ProductAttribute.ValidateInputParams[],
): boolean {
  const requiredAttribute = attributes.filter(
    (attribute) =>
      !attribute.isOptional ||
      attribute.category === InputAttributeEnum.NUMBER_UNIT_PAIR,
  );
  for (const attribute of requiredAttribute) {
    switch (attribute.category) {
      case InputAttributeEnum.ATTACHMENTS:
        if (
          (has(attribute.value, 'values') &&
            isEmpty(get(attribute.value, 'values')) &&
            isEmpty(get(attribute.value, 'selectedFiles'))) ||
          isEmpty(attribute.value)
        ) {
          return false;
        }
        break;
      case InputAttributeEnum.NUMBER:
      case InputAttributeEnum.PERCENTAGE:
        if (attribute.value === 0) {
          return false;
        }
        break;
      case InputAttributeEnum.NUMBER_UNIT_PAIR:
        if (attribute.isOptional) {
          if (
            (!isNull(attribute.value) && isNull(attribute.quantityUnit)) ||
            (isNull(attribute.value) && !isNull(attribute.quantityUnit))
          ) {
            return false;
          }
        } else if (isNull(attribute.value) || isNull(attribute.quantityUnit)) {
          return false;
        }
        break;
      case InputAttributeEnum.DATE:
        if (isNull(attribute.value)) {
          return false;
        }
        break;
      case InputAttributeEnum.TEXT:
      case InputAttributeEnum.UNIQUE_ID:
      case InputAttributeEnum.LIST:
      case InputAttributeEnum.COUNTRY:
      case InputAttributeEnum.PROVINCE:
      case InputAttributeEnum.DISTRICT:
        if (isEmpty(attribute.value)) {
          return false;
        }
        break;
      default:
        break;
    }
  }
  return true;
}

export function getAttributeProperties(
  productAttribute:
    | ProductAttribute.ProductDefinitionAttribute
    | ProductAttribute.AttributeParams,
): ProductAttribute.Entity {
  const currentLocale = AppModule.locale;
  const defaultName = get(productAttribute, 'attribute.name', '');
  const name = get(
    productAttribute,
    `attribute.nameTranslation.${currentLocale}`,
    defaultName,
  );
  return {
    id: get(productAttribute, 'attribute.id', ''),
    name,
    type: get(productAttribute, 'attribute.type'),
    category: get(productAttribute, 'attribute.category'),
    isOptional: productAttribute.isOptional,
    label: productAttribute.isOptional
      ? translate('item_optional', {
          item: name,
        })
      : name,
  };
}

export function getProductsWeightTotal(
  products: ProductAttribute.ProductAttributeData[],
): number {
  const data = products.reduce((result, product) => {
    const attributeDetail = product.attributes.find(
      (attr: ProductAttribute.AttributeParams) =>
        attr.type === ProductAttributeTypeEnum.PRODUCT_QUANTITY ||
        get(attr, 'attribute.type', '') ===
          ProductAttributeTypeEnum.PRODUCT_QUANTITY,
    );
    if (attributeDetail && isCanCalculateWeight(attributeDetail)) {
      result.push(getDataAttributeUnitWeight(attributeDetail));
    }
    return result;
  }, []);

  return sumBy(data, (attr: Purchase.AttributeWeightUnit) =>
    convertUnitToKg(attr.totalWeight, attr.weightUnit),
  );
}

export function isCanCalculateWeight(
  attribute: ProductAttribute.AttributeParams,
): boolean {
  const availableUnits: AvailableWeightUnit[] = [
    AvailableWeightUnit.KG,
    AvailableWeightUnit.LBS,
    AvailableWeightUnit.UNIT,
  ];
  return includes(availableUnits, attribute.quantityUnit.toUpperCase());
}

export function getDataAttributeUnitWeight(
  attribute: ProductAttribute.AttributeParams,
): Purchase.AttributeWeightUnit {
  return {
    totalWeight: Number(attribute.value),
    weightUnit: attribute.quantityUnit.toUpperCase(),
  };
}

export function showProductQuantity(
  products: ProductAttribute.ProductAttributeData[],
): boolean {
  return every(products, ({ attributes }) => {
    const attributeDetail = attributes.find(
      (attr: ProductAttribute.AttributeParams) =>
        attr.type === ProductAttributeTypeEnum.PRODUCT_QUANTITY ||
        get(attr, 'attribute.type', '') ===
          ProductAttributeTypeEnum.PRODUCT_QUANTITY,
    );
    return attributeDetail && isCanCalculateWeight(attributeDetail);
  });
}

export function validProductId(
  id: string,
  products: ProductManagement.AddedProduct[],
): boolean {
  const productIds = products.reduce((result, product) => {
    const attributeId = product.attributes.find(
      (attr: ProductAttribute.AttributeParams) =>
        attr.type === ProductAttributeTypeEnum.PRODUCT_ID ||
        get(attr, 'attribute.type', '') === ProductAttributeTypeEnum.PRODUCT_ID,
    );
    if (attributeId) {
      result.push(attributeId.value);
    } else {
      result.push(get(product, 'qrCode', ''));
    }
    return result;
  }, []);
  return !includes(productIds, id);
}

export function getProductId(product: ProductManagement.AddedProduct): string {
  const { attributes, qrCode } = product;
  const currentProduct = find(
    attributes,
    (attribute) => attribute.type === ProductAttributeTypeEnum.PRODUCT_ID,
  );
  return get(currentProduct, 'value', qrCode);
}

export function getTransactionLevel(
  attributes: ProductAttribute.AttributeParams[],
): string {
  const result = [];
  const moistureLevel = find(attributes, (attribute) => {
    const { label, category } = getAttributeProperties(attribute);
    return (
      label.toLocaleLowerCase() === TransactionLevel.MOISTURE_LEVEL &&
      category === InputAttributeEnum.PERCENTAGE
    );
  });
  const trashContent = find(attributes, (attribute) => {
    const { label, category } = getAttributeProperties(attribute);
    return (
      label.toLocaleLowerCase() === TransactionLevel.TRASH_CONTENT &&
      category === InputAttributeEnum.LIST
    );
  });

  if (trashContent) {
    result.push(trashContent.value);
  }

  if (moistureLevel) {
    result.push(`${moistureLevel.value} %`);
  }

  return result.length > 0 ? result.join(', ') : null;
}
