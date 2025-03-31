/* eslint-disable max-lines */
import { Vue, Component, Prop, Ref } from 'vue-property-decorator';
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
  @Prop({ required: true }) currentProduct: App.DropdownOption;
  @Prop({ required: true }) currentNode: SupplyChain.Node;
  @Prop({ required: true }) currentNewNode: SupplyChain.Node;
  @Prop({ default: [] }) selectedProducts: ProductManagement.Product[];

  @Prop({
    default: () => {
      //
    },
  })
  change: (data: SupplyChain.Calculator) => void;

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

  created() {
    this.initData();
  }

  initData() {
    this.initCalculatedFieldOptions();
    this.initAssignToOptions();
    this.calculationOptions = uniqBy(
      [...this.inputAttributes, ...this.calculationOptions],
      'id',
    );
    this.isValid = this.validateInputData();
    if (this.isValid) {
      this.initAssignTo();
      this.initCalculatorField();
    }
    this.change(this.getPayload());
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
      const products = productModule.products.filter(({ id }) =>
        this.currentNode.outputProductDefinitionIds.includes(id),
      );
      this.inputAttributes = this.getAttributesOptions(products, true);
    }
  }

  initAssignTo() {
    const outputAttribute = this.outputAttributes.find(
      ({ value }) =>
        value === get(this.selectedCalculator, 'outputAttributeId'),
    );
    if (outputAttribute) {
      this.changeOutputAttribute(outputAttribute);
    }
  }

  getProductAttributeId(item: SupplyChain.ExpressionItem) {
    if (isUUID(item.value as string)) {
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
    const expressionItems = get(this.selectedCalculator, 'expressionItems', []);
    expressionItems.forEach((item: SupplyChain.ExpressionItem) => {
      const expressionId = this.getProductAttributeId(item);
      const inputAttribute = this.inputAttributes.find(
        ({ id }) => id === expressionId,
      );
      const name = get(inputAttribute, 'name', item.value) as string;
      if (name) {
        this.selectedFields.push({
          name,
          id: expressionId,
          value: item.value as string,
        });
      }
    });
  }

  validateInputData() {
    if (this.currentNode) {
      return this.validateAssignTo() && this.validateCalculatedInput();
    }
    return false;
  }

  validateAssignTo(): boolean {
    const outputAttribute = this.outputAttributes.find(
      ({ value }) =>
        value === get(this.selectedCalculator, 'outputAttributeId'),
    );
    return !isEmpty(outputAttribute);
  }

  validateCalculatedInput(): boolean {
    const expressionItems = get(this.selectedCalculator, 'expressionItems', []);
    return this.variablesValidated(expressionItems);
  }

  variablesValidated(expressionItems: SupplyChain.ExpressionItem[]): boolean {
    if (!isEmpty(expressionItems)) {
      const variableValues = flatMap(
        expressionItems.filter(
          ({ type }) => type === ExpressionTypeEnum.VARIABLE,
        ),
        'id',
      );
      return this.inputAttributes.some(({ id }) => variableValues.includes(id));
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
      supplyChainNodeMetadataId: this.currentNewNode.id,
      outputAttributeId: get(outputAttribute, 'id') as string,
      outputProductDefinitionId: this.currentProduct.id as string,
      inputProductDefinitionIds: this.currentNode.outputProductDefinitionIds,
      expressionItems: this.getExpressionItems(),
    };
  }

  resetCalculatedFieldData() {
    this.selectedOutputAttribute = null;
    this.selectedFields = [];
    this.inputTag.resetData();
    this.initAssignToOptions();
    this.change(this.getPayload());
  }

  isAttributeId(attributeId: string | number): boolean {
    return (
      isString(attributeId) &&
      !MATH_CALCULATION.some(({ id }) => attributeId === id)
    );
  }

  onChangeInputTag(options: App.DropdownOption[]) {
    this.selectedFields = options;
    this.isValid = this.validateInputData();
    this.change(this.getPayload());
    this.onClearMessageErrors();
  }

  changeOutputAttribute(option: App.DropdownOption): void {
    this.selectedOutputAttribute = option;
    this.isValid = this.validateInputData();
    this.change(this.getPayload());
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
