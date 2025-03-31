/* eslint-disable max-lines */
import { Vue, Component, Prop, Ref, Watch } from 'vue-property-decorator';
import {
  flatMap,
  forEach,
  get,
  head,
  isEmpty,
  isNumber,
  isString,
  last,
  map,
  uniqBy,
} from 'lodash';
import AppModule from 'store/modules/app';
import { ExpressionTypeEnum, InputAttributeEnum } from 'enums/app';
import Dropdown from 'components/FormUI/Dropdown';
import InputTag from 'components/FormUI/Input/InputTag';
import productModule from 'store/modules/product';
import MessageError from 'components/FormUI/MessageError';
import {
  isDuplicateCalculation,
  isDuplicateNumber,
  isUUID,
} from 'utils/helpers';
import { MATH_CALCULATION } from 'config/constants';
import * as Styled from './styled';

@Component
export default class CalculateField extends Vue {
  @Prop({ required: true }) supplyChain: SupplyChain.SupplyChainMapping;
  @Prop({ required: true }) currentProduct: App.DropdownOption;
  @Prop({ required: true }) currentNode: SupplyChain.Node;
  @Prop({ default: [] }) selectedProducts: ProductManagement.Product[];

  @Prop({
    default: () => {
      //
    },
  })
  change: (data: SupplyChain.Calculator, isValid: boolean) => void;

  @Ref('inputTagComponent')
  readonly inputTag!: InputTag;

  public messageErrors: App.MessageError = null;
  public isValid = true;

  private outputAttributes: App.DropdownOption[] = [];
  private selectedOutputAttribute: App.DropdownOption = null;

  private inputAttributes: App.DropdownOption[] = [];
  private selectedFields: App.DropdownOption[] = [];
  private calculationOptions: App.DropdownOption[] = MATH_CALCULATION;
  private selectedCalculator: SupplyChain.Calculator = {
    outputAttributeId: null,
    outputProductDefinitionId: null,
    expressionItems: [],
    supplyChainNodeMetadataId: null,
    inputProductDefinitionIds: [],
  };

  get currentLocale(): string {
    return AppModule.locale;
  }

  get isValidFields(): boolean {
    if (isEmpty(this.selectedFields)) {
      return true;
    }
    if (this.selectedFields.length === 1 || this.selectedFields.length === 2) {
      return false;
    }
    let selectedFields: Array<number | string> = flatMap(
      this.selectedFields,
      'id',
    );
    selectedFields = map(selectedFields, (id) =>
      this.isAttributeId(id) ? 1 : id,
    );
    try {
      const calculation = selectedFields.join(' ');
      if (
        isDuplicateCalculation(calculation) ||
        isDuplicateNumber(calculation)
      ) {
        return false;
      }
      const value = eval(calculation);
      return isNumber(value);
    } catch (error) {
      return false;
    }
  }

  get expressionItems(): SupplyChain.ExpressionItem[] {
    return get(this.selectedCalculator, 'expressionItems', []);
  }

  @Watch('currentProduct', { immediate: true, deep: true })
  onChangeQuery() {
    this.initData();
  }

  initData() {
    this.initCalculatedFieldOptions();
    this.initAssignToOptions();
    this.calculationOptions = uniqBy(
      [...this.inputAttributes, ...this.calculationOptions],
      'id',
    );
    const calculator = this.currentNode.calculateFields.find(
      ({ outputProductDefinitionId }) =>
        this.currentProduct.id === outputProductDefinitionId,
    );
    if (calculator) {
      this.selectedCalculator = calculator;
    }
    this.isValid = this.validateInputData();
    if (this.isValid) {
      this.initAssignTo();
      this.initCalculatorField();
    }
    this.change(this.getPayload(), this.isValid);
  }

  initAssignToOptions() {
    if (!isEmpty(this.currentProduct)) {
      const product = productModule.products.find(
        ({ id }) => this.currentProduct.id === id,
      );
      this.outputAttributes = this.getAttributesOptions([product], false);
    }
  }

  initCalculatedFieldOptions() {
    if (this.currentNode) {
      this.inputAttributes = this.getAttributesOptions(
        this.selectedProducts,
        true,
      );
    }
  }

  initAssignTo() {
    const outputAttribute = this.outputAttributes.find(
      ({ id }) => id === get(this.selectedCalculator, 'outputAttributeId'),
    );
    if (outputAttribute) {
      this.changeOutputAttribute(outputAttribute);
    }
  }

  getProductAttributeId(item: SupplyChain.ExpressionItem) {
    if (item.value && isString(item.value) && isUUID(item.value as string)) {
      return `${item.value}|${item.productDefinitionId}`;
    }
    return item.value;
  }

  getAttributeId(id: string): string {
    return head(id.split('|'));
  }

  getProductDefinitionId(id: string): string {
    return last(id.split('|'));
  }

  initCalculatorField() {
    this.expressionItems.forEach((item: SupplyChain.ExpressionItem) => {
      const productAttributeId = this.getProductAttributeId(item);
      const inputAttribute = this.inputAttributes.find(
        ({ id }) => id === productAttributeId,
      );
      const name = get(inputAttribute, 'name', item.value) as string;
      if (name) {
        this.selectedFields.push({
          name,
          id: productAttributeId,
        });
      }
    });
  }

  validateInputData() {
    if (
      isEmpty(this.selectedOutputAttribute) &&
      isEmpty(this.expressionItems)
    ) {
      return true;
    } else if (this.currentNode) {
      return (
        this.validateAssignTo() &&
        this.validateCalculatedInput() &&
        this.isValidFields
      );
    }
    return false;
  }

  validateAssignTo(): boolean {
    const outputAttribute = this.outputAttributes.find(
      ({ id }) => id === get(this.selectedCalculator, 'outputAttributeId'),
    );
    return !isEmpty(outputAttribute);
  }

  validateCalculatedInput(): boolean {
    if (!isEmpty(this.expressionItems)) {
      const variableValues = map(
        this.expressionItems.filter(
          ({ type }) => type === ExpressionTypeEnum.VARIABLE,
        ),
        ({ value, productDefinitionId }) => `${value}|${productDefinitionId}`,
      );
      return this.inputAttributes.some(({ id }) =>
        variableValues.includes(id as string),
      );
    }
    return false;
  }

  getAttributesOptions(
    products: ProductManagement.Product[],
    isCalculatedField: boolean,
  ): App.DropdownOption[] {
    const options: App.DropdownOption[] = [];
    forEach(products, (product) => {
      const attributes = product.productDefinitionAttributes.filter(
        ({ attribute }) =>
          [
            InputAttributeEnum.NUMBER,
            InputAttributeEnum.PERCENTAGE,
            InputAttributeEnum.NUMBER_UNIT_PAIR,
          ].includes(attribute.category),
      );

      forEach(attributes, ({ attributeId, attribute }) => {
        const id = isCalculatedField
          ? `${attributeId}|${product.id}`
          : attributeId;
        const productName =
          product.nameTranslation[this.currentLocale] || product.name;
        const attributeName =
          attribute.nameTranslation[this.currentLocale] || attribute.name;
        options.push({
          id,
          name: `${productName}.${attributeName}`,
        });
      });
    });

    return options;
  }

  getExpressionItems(): SupplyChain.ExpressionItem[] {
    return this.selectedFields.map((item) => {
      const isVariable = this.inputAttributes.some(({ id }) => id === item.id);
      const type = isVariable
        ? ExpressionTypeEnum.VARIABLE
        : ExpressionTypeEnum.CONSTANT;
      const value = isVariable
        ? this.getAttributeId(item.id as string)
        : item.id;
      const productDefinitionId = isVariable
        ? this.getProductDefinitionId(item.id as string)
        : undefined;
      return {
        type,
        value,
        productDefinitionId,
      };
    });
  }

  getPayload(): SupplyChain.Calculator {
    const outputAttribute = this.outputAttributes.find(
      ({ id }) => id === get(this.selectedOutputAttribute, 'id'),
    );
    return {
      supplyChainNodeMetadataId: this.currentNode.id,
      outputAttributeId: get(outputAttribute, 'id') as string,
      outputProductDefinitionId: this.currentProduct.id as string,
      inputProductDefinitionIds: flatMap(this.selectedProducts, 'id'),
      expressionItems: this.getExpressionItems(),
    };
  }

  isAttributeId(attributeId: string | number): boolean {
    return (
      isString(attributeId) &&
      !MATH_CALCULATION.some(({ id }) => attributeId === id)
    );
  }

  onChangeInputTag(options: App.DropdownOption[]) {
    this.selectedFields = options;
    this.selectedCalculator.expressionItems = this.getExpressionItems();
    this.isValid = this.validateInputData();
    this.change(this.getPayload(), this.isValid);
    this.onClearMessageErrors();
  }

  changeOutputAttribute(option: App.DropdownOption): void {
    this.selectedOutputAttribute = option;
    this.selectedCalculator.outputAttributeId = option.id as string;
    this.isValid = this.validateInputData();
    this.change(this.getPayload(), this.isValid);
    this.onClearMessageErrors();
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  renderCalculationsField(): JSX.Element {
    return (
      <Styled.Row>
        <InputTag
          ref="inputTagComponent"
          value={this.selectedFields}
          hasError={!this.isValidFields}
          placeholder={this.$t('press_enter_to_add')}
          label={this.$t('calculated_field')}
          tooltipContent={this.$t('calculated_field_information')}
          options={this.calculationOptions}
          change={this.onChangeInputTag}
        />
        {this.messageErrors && (
          <MessageError
            field="expressionItems"
            messageErrors={this.messageErrors}
          />
        )}
      </Styled.Row>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <Styled.Header>
          <Styled.Title>{this.$t('enter_calculated_field_for')}</Styled.Title>
          <Styled.Tag>{get(this.currentProduct, 'name')}</Styled.Tag>
        </Styled.Header>
        <Dropdown
          title={this.$t('assign_to')}
          options={this.outputAttributes}
          height="48px"
          trackBy="id"
          value={this.selectedOutputAttribute}
          changeOptionValue={this.changeOutputAttribute}
          placeholder={this.$t('select_output_product_attribute')}
          allowEmpty={false}
        />
        {this.renderCalculationsField()}
      </Styled.Wrapper>
    );
  }
}
