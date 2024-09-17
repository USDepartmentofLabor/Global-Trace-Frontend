/* eslint-disable max-lines */
import { Vue, Component, Prop } from 'vue-property-decorator';
import { flatMap, get, isEmpty, isNumber, isString, map, uniqBy } from 'lodash';
import { MATH_CALCULATION } from 'config/constants';
import { getProduct } from 'api/product-management';
import { handleError } from 'components/Toast';
import { validateCalculatedField } from 'api/supply-chain';
import AppModule from 'store/modules/app';
import MessageError from 'components/FormUI/MessageError';
import { isDuplicateCalculation, isDuplicateNumber } from 'utils/helpers';
import { ExpressionTypeEnum, InputAttributeEnum } from 'enums/app';
import { SpinLoading } from 'components/Loaders';
import Button from 'components/FormUI/Button';
import InputGroup from 'components/FormUI/InputGroup';
import Dropdown from 'components/FormUI/Dropdown';
import InputTag from 'components/FormUI/Input/InputTag';
import * as Styled from '../../styled';

@Component
export default class Calculator extends Vue {
  @Prop({ default: null }) isCreate: boolean;
  @Prop({ default: null }) fromNode: SupplyChain.Node;
  @Prop({ default: null }) selectedCalculator: SupplyChain.Calculator;
  @Prop({ default: null }) selectedProduct: ProductManagement.Product;
  @Prop({
    default: () => {
      //
    },
  })
  cancel: () => void;
  @Prop({
    default: () => {
      //
    },
  })
  change: (data: SupplyChain.ValidateCalculatorParams) => void;

  private isLoading = false;
  private isSubmitting = false;
  private selectedOutputAttribute: App.DropdownOption = null;
  private inputAttributes: App.DropdownOption[] = [];
  private outputAttributes: App.DropdownOption[] = [];
  private selectedFields: App.DropdownOption[] = [];
  private calculationOptions: App.DropdownOption[] = MATH_CALCULATION;
  public messageErrors: App.MessageError = null;

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

  get isDisabled(): boolean {
    return !this.isValidFields || isEmpty(this.selectedOutputAttribute);
  }

  created() {
    this.initData();
  }

  async initData() {
    this.isLoading = true;
    await Promise.all([
      this.initCalculatedFieldOptions(),
      this.initAssignToOptions(),
    ]);
    this.calculationOptions = uniqBy(
      [...this.inputAttributes, ...this.calculationOptions],
      'id',
    );
    if (this.validateInputData()) {
      this.initAssignTo();
      this.initCalculatorField();
    } else {
      this.change(null);
    }

    this.isLoading = false;
  }

  validateInputData() {
    if (this.fromNode) {
      return this.validateAssignTo() && this.validateCalculatedInput();
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
    const expressionItems = get(this.selectedCalculator, 'expressionItems', []);
    return this.variablesValidated(expressionItems);
  }

  async initCalculatedFieldOptions() {
    try {
      if (this.fromNode) {
        const product = await getProduct(
          this.fromNode.outputProductDefinitionId,
        );
        this.inputAttributes = this.getAttributesOptions(product);
      }
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  async initAssignToOptions() {
    try {
      if (this.selectedProduct) {
        const product = await getProduct(this.selectedProduct.id);
        this.outputAttributes = this.getAttributesOptions(product);
      }
    } catch (error) {
      handleError(error as App.ResponseError);
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

  initCalculatorField() {
    const expressionItems = get(this.selectedCalculator, 'expressionItems', []);
    expressionItems.forEach((item: SupplyChain.ExpressionItem) => {
      const inputAttribute = this.inputAttributes.find(
        ({ id }) => id === item.value,
      );
      const name = get(inputAttribute, 'name', item.value) as string;
      if (name) {
        this.selectedFields.push({
          name,
          id: item.value,
        });
      }
    });
  }

  variablesValidated(expressionItems: SupplyChain.ExpressionItem[]): boolean {
    if (!isEmpty(expressionItems)) {
      const variableValues = flatMap(
        expressionItems.filter(
          ({ type }) => type === ExpressionTypeEnum.VARIABLE,
        ),
        'value',
      );
      return this.inputAttributes.some(({ id }) => variableValues.includes(id));
    }
    return false;
  }

  getAttributesOptions(
    product: ProductManagement.Product,
  ): App.DropdownOption[] {
    const attributes = product.productDefinitionAttributes.filter(
      ({ attribute }) =>
        [
          InputAttributeEnum.NUMBER,
          InputAttributeEnum.PERCENTAGE,
          InputAttributeEnum.NUMBER_UNIT_PAIR,
        ].includes(attribute.category),
    );
    return map(attributes, ({ attributeId, attribute }) => {
      const name =
        attribute.nameTranslation[this.currentLocale] || attribute.name;
      return {
        id: attributeId,
        name,
      };
    });
  }

  isAttributeId(attributeId: string | number): boolean {
    return (
      isString(attributeId) &&
      !MATH_CALCULATION.some(({ id }) => attributeId === id)
    );
  }

  changeOutputAttribute(option: App.DropdownOption): void {
    this.selectedOutputAttribute = option;
    this.onClearMessageErrors();
  }

  onChangeInputTag(options: App.DropdownOption[]) {
    this.selectedFields = options;
    this.onClearMessageErrors();
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  getExpressionItems(): SupplyChain.ExpressionItem[] {
    return this.selectedFields.map((item) => {
      const isVariable = this.inputAttributes.some(({ id }) => id === item.id);
      return {
        type: isVariable
          ? ExpressionTypeEnum.VARIABLE
          : ExpressionTypeEnum.CONSTANT,
        value: item.id,
      };
    });
  }

  getPayload(): SupplyChain.ValidateCalculatorParams {
    const outputAttribute = this.outputAttributes.find(
      ({ id }) => id === this.selectedOutputAttribute.id,
    );
    return {
      outputAttributeId: get(outputAttribute, 'id') as string,
      outputProductDefinitionId: this.selectedProduct.id as string,
      inputProductDefinitionId: this.fromNode.outputProductDefinitionId,
      expressionItems: this.getExpressionItems(),
    };
  }

  async success(): Promise<void> {
    try {
      this.isSubmitting = true;
      const payload = this.getPayload();
      await validateCalculatedField(payload);
      this.change(payload);
    } catch (error) {
      this.messageErrors = get(error, 'errors');
      if (error) {
        handleError(error as App.ResponseError);
      }
    } finally {
      this.isSubmitting = false;
    }
  }

  renderOptionBody(option: App.DropdownOption): JSX.Element {
    return <Styled.OptionLabel>{option.name}</Styled.OptionLabel>;
  }

  renderCalculationsField(): JSX.Element {
    return (
      <Styled.Row>
        <InputTag
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

  renderAction(): JSX.Element {
    return (
      <Styled.Actions>
        <Button
          width="100%"
          variant="outlinePrimary"
          label={this.$t('common.action.cancel')}
          click={this.cancel}
        />
        <Button
          label={this.$t('common.action.save')}
          width="100%"
          disabled={this.isDisabled || this.isSubmitting}
          isLoading={this.isSubmitting}
          click={this.success}
        />
      </Styled.Actions>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Form>
        {this.isLoading && <SpinLoading isInline={false} />}
        <InputGroup>
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
          {this.renderAction()}
        </InputGroup>
      </Styled.Form>
    );
  }
}
