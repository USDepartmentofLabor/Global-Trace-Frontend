import { Vue, Component, Prop, Ref } from 'vue-property-decorator';
import { flatMap, has, isEmpty } from 'lodash';
import Button from 'components/FormUI/Button';
import { handleError } from 'components/Toast';
import { createCalculatedField, updateCalculatedField } from 'api/supply-chain';
import productModule from 'store/modules/product';
import * as Styled from './styled';
import CalculateField from './elements/CalculatedField/CalculatedField';

@Component
export default class EditCalculatedFieldModal extends Vue {
  @Prop({ required: true }) chainId: string;
  @Prop({ required: true }) supplyChain: SupplyChain.SupplyChainMapping;
  @Prop({ required: true }) roleOptions: RoleAndPermission.Role[];
  @Prop({ required: true }) productOptions: ProductManagement.Product[];
  @Prop({ required: true }) currentNode: SupplyChain.Node;
  @Prop({ required: true }) success: (
    nodeId: string,
    data: SupplyChain.Calculator,
    isEdit: boolean,
  ) => void;

  @Ref('calculateFieldComponent')
  readonly calculateField!: CalculateField;

  private isSubmitting = false;
  private isValid = false;
  private calculatedFieldData: SupplyChain.Calculator = null;
  private show = true;
  private productIndex = 0;

  get isDone(): boolean {
    return this.productIndex + 1 === this.productOutputs.length;
  }

  get submitLabel(): string {
    return this.isDone ? this.$t('done') : this.$t('continue');
  }

  get submitIcon(): string {
    if (!this.isDone) {
      return 'arrow_right';
    }
    return null;
  }

  get productOutputs(): App.DropdownOption[] {
    return productModule.products.filter(({ id }) =>
      this.currentNode.outputProductDefinitionIds.includes(id),
    );
  }

  get currentProduct(): App.DropdownOption {
    return this.productOutputs[this.productIndex];
  }

  get currentCalculatedField(): SupplyChain.Calculator {
    return this.currentNode.calculateFields.find(
      ({ outputProductDefinitionId }) =>
        outputProductDefinitionId === this.currentProduct.id,
    );
  }

  get parentNodes(): SupplyChain.Node[] {
    const lines = this.supplyChain.lines.filter(
      ({ toNodeId }) => toNodeId === this.currentNode.id,
    );
    const lineIds = flatMap(lines, 'fromNodeId');
    return this.supplyChain.nodes.filter(({ id }) => lineIds.includes(id));
  }

  get inputProductDefinitionIds(): string[] {
    return flatMap(this.parentNodes, 'outputProductDefinitionIds');
  }

  get inputProductDefinitions(): ProductManagement.Product[] {
    return productModule.products.filter(({ id }) =>
      this.inputProductDefinitionIds.includes(id),
    );
  }

  closeModal(): void {
    this.$emit('close');
  }

  changeCalculatedField(data: SupplyChain.Calculator, isValid: boolean) {
    this.calculatedFieldData = data;
    this.isValid = isValid;
  }

  async updateCalculator() {
    try {
      if (
        !isEmpty(this.calculatedFieldData.expressionItems) &&
        has(this.calculatedFieldData, 'outputAttributeId')
      ) {
        this.isSubmitting = true;
        let newCalculateField = null;
        if (this.currentCalculatedField) {
          await updateCalculatedField(
            this.currentCalculatedField.id as string,
            {
              id: this.currentCalculatedField.id,
              ...this.calculatedFieldData,
            },
          );
          newCalculateField = {
            id: this.currentCalculatedField.id,
            ...this.calculatedFieldData,
          };
        } else {
          newCalculateField = await createCalculatedField(
            this.calculatedFieldData,
          );
        }
        this.success(
          this.currentNode.id,
          newCalculateField,
          !isEmpty(this.currentCalculatedField),
        );
      }
      this.nextStep();
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isSubmitting = false;
    }
  }

  nextStep() {
    if (this.isDone) {
      this.closeModal();
    } else {
      this.show = false;
      this.productIndex++;
      this.$nextTick(() => {
        this.show = true;
      });
    }
  }

  renderActions(): JSX.Element {
    return (
      <Styled.Actions>
        <Styled.ButtonGroupEnd>
          <Button
            type="button"
            variant="transparentPrimary"
            label={this.$t('common.action.cancel')}
            click={this.closeModal}
          />
          <Button
            variant="primary"
            icon={this.submitIcon}
            iconPosition="suffix"
            label={this.submitLabel}
            disabled={!this.isValid || this.isSubmitting}
            isLoading={this.isSubmitting}
            click={this.updateCalculator}
          />
        </Styled.ButtonGroupEnd>
      </Styled.Actions>
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout
        title={this.$t('edit_calculated_field')}
        closeModal={this.closeModal}
      >
        <Styled.Wrapper>
          {this.show && (
            <CalculateField
              ref="calculateFieldComponent"
              supplyChain={this.supplyChain}
              currentProduct={this.currentProduct}
              currentNode={this.currentNode}
              selectedProducts={this.inputProductDefinitions}
              change={this.changeCalculatedField}
            />
          )}
          {this.renderActions()}
        </Styled.Wrapper>
      </modal-layout>
    );
  }
}
