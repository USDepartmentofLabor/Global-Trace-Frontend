import { Vue, Component, Prop, Ref } from 'vue-property-decorator';
import { every, flatMap, get, has, isEmpty, map } from 'lodash';
import Button from 'components/FormUI/Button';
import { handleError } from 'components/Toast';
import { resetModalHeight } from 'utils/helpers';
import {
  createCalculatedField,
  createSupplyChainNodes,
} from 'api/supply-chain';
import * as Styled from './styled';
import CalculateField from './elements/CalculatedField/CalculatedField';
import DownstreamSupplierList from './elements/DownstreamSupplierList/DownstreamSupplierList';

@Component
export default class AddDownstreamSupplierModal extends Vue {
  @Prop({ required: true }) chainId: string;
  @Prop({ required: true }) supplyChain: SupplyChain.SupplyChainMapping;
  @Prop({ required: true }) roleOptions: RoleAndPermission.Role[];
  @Prop({ required: true }) productOptions: ProductManagement.Product[];
  @Prop({ required: true }) currentNode: SupplyChain.Node;
  @Prop({ required: true }) onSuccess: (nodes: SupplyChain.Node[]) => void;
  @Prop({ required: true }) addedCalculatedField: (
    newNodeId: string,
    data: SupplyChain.Calculator,
  ) => void;

  @Ref('calculateFieldComponent')
  readonly calculateField!: CalculateField;

  private topBuffer = 100;
  private leftBuffer = 300;
  private isEditCalculator = false;
  private isSubmitting = false;
  private downstreamSupplierData: SupplyChain.DownstreamSupplierListParams[] =
    [];
  private calculatedFieldData: SupplyChain.Calculator = null;
  private newNodes: SupplyChain.Node[] = [];
  private productIndex = 0;

  get isDone(): boolean {
    return (
      this.isEditCalculator &&
      this.productIndex + 1 === this.selectedProducts.length
    );
  }

  get title(): string {
    return this.isEditCalculator
      ? this.$t('add_calculated_field')
      : this.$t('add_downstream_supplier');
  }

  get submitLabel(): string {
    if (this.isEditCalculator) {
      return this.isDone ? this.$t('done') : this.$t('continue');
    }
    return this.$t('add_calculated_field');
  }

  get submitIcon(): string {
    if (this.isEditCalculator && !this.isDone) {
      return 'arrow_right';
    }
    return null;
  }

  get isDisabled(): boolean {
    if (this.isEditCalculator) {
      return get(this.calculateField, 'isValid', false);
    }
    return !this.isValidDownstreamSupplier;
  }

  get isValidDownstreamSupplier(): boolean {
    return (
      !isEmpty(this.downstreamSupplierData) &&
      every(
        this.downstreamSupplierData,
        ({ roleId, productOutputsIds }) =>
          !isEmpty(roleId) && !isEmpty(productOutputsIds),
      )
    );
  }

  get productOutputs(): App.DropdownOption[] {
    return this.productOptions.filter(
      ({ id }) =>
        !flatMap(this.downstreamSupplierData, 'productOutputsIds').includes(id),
    );
  }

  get currentProduct(): App.DropdownOption {
    return this.isEditCalculator
      ? this.selectedProducts[this.productIndex]
      : null;
  }

  get selectedProducts(): App.DropdownOption[] {
    return this.productOptions.filter(({ id }) =>
      flatMap(this.downstreamSupplierData, 'productOutputsIds').includes(id),
    );
  }

  get currentNewNode(): SupplyChain.Node {
    if (this.isEditCalculator) {
      const index = this.downstreamSupplierData.findIndex(
        ({ productOutputsIds }) =>
          productOutputsIds.includes(this.currentProduct.id as string),
      );
      if (index > -1) {
        return this.newNodes[index];
      }
    }
    return null;
  }

  get roles(): RoleAndPermission.Role[] {
    return this.roleOptions.filter(({ id }) => {
      const lines = this.supplyChain.lines.filter(
        ({ fromNodeId }) => fromNodeId === this.currentNode.id,
      );
      const childrenRoleIds = flatMap(lines, 'relation.roleId');
      return !childrenRoleIds.includes(id);
    });
  }

  closeModal(): void {
    this.$emit('close');
  }

  changeDownstreamSupplier(data: SupplyChain.DownstreamSupplierListParams[]) {
    this.downstreamSupplierData = data;
    this.$nextTick(() => {
      resetModalHeight(this.$el);
    });
  }

  changeCalculatedField(data: SupplyChain.Calculator) {
    this.calculatedFieldData = data;
  }

  onSubmit() {
    if (this.isEditCalculator) {
      this.createCalculator();
    } else {
      this.createNodes();
    }
  }

  getPositionParams(roleId: string, index: number): SupplyChain.NodePosition {
    const node = this.supplyChain.nodes.find((node) => node.roleId === roleId);
    if (node) {
      return node.position;
    }
    const top = this.getBaseTop();
    return {
      top: top + index * this.topBuffer,
      left: get(this.currentNode, 'position.left', 0) + this.leftBuffer,
    };
  }

  getBaseTop(): number {
    const lines = this.supplyChain.lines.filter(
      ({ fromNodeId }) => fromNodeId === this.currentNode.id,
    );
    let top = this.currentNode.position.top;
    if (!isEmpty(lines)) {
      lines.forEach((line) => {
        const toNode = this.supplyChain.nodes.find(
          ({ id }) => line.toNodeId === id,
        );
        if (toNode && toNode.position.top > top) {
          top = toNode.position.top;
        }
      });
      top += this.topBuffer;
    }

    return top;
  }

  getCreateNodePayload(): SupplyChain.NodeParams[] {
    return map(
      this.downstreamSupplierData,
      ({ roleId, productOutputsIds }, index) => {
        return {
          roleId: roleId,
          fromRoleId: get(this.currentNode, 'roleId', ''),
          outputProductDefinitionIds: productOutputsIds,
          position: this.getPositionParams(roleId, index),
          chainId: this.chainId,
        };
      },
    );
  }

  async createNodes() {
    try {
      this.isSubmitting = true;
      const payload = this.getCreateNodePayload();
      let response = await createSupplyChainNodes({
        supplyChainNodes: payload,
      });
      response = response.map((item) => {
        item.relation = {
          id: item.id,
          outputProductDefinitionIds: item.outputProductDefinitionIds,
        };
        item.id = item.supplyChainNodeMetadataId;
        return item;
      });
      this.newNodes = response;
      this.onSuccess(response);
      this.isEditCalculator = true;
      this.$nextTick(() => {
        resetModalHeight(this.$el);
      });
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isSubmitting = false;
    }
  }

  async createCalculator() {
    try {
      if (
        !isEmpty(this.calculatedFieldData.expressionItems) &&
        has(this.calculatedFieldData, 'outputAttributeId')
      ) {
        this.isSubmitting = true;
        const calculatedField = await createCalculatedField(
          this.calculatedFieldData,
        );
        this.addedCalculatedField(this.currentNewNode.id, calculatedField);
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
      this.productIndex++;
      this.$nextTick(() => {
        this.calculateField.resetCalculatedFieldData();
      });
    }
  }

  renderContent(): JSX.Element {
    if (this.isEditCalculator) {
      return (
        <CalculateField
          ref="calculateFieldComponent"
          currentProduct={this.currentProduct}
          currentNode={this.currentNode}
          currentNewNode={this.currentNewNode}
          selectedProducts={this.selectedProducts}
          change={this.changeCalculatedField}
        />
      );
    }
    return (
      <DownstreamSupplierList
        value={this.downstreamSupplierData}
        roleOptions={this.roles}
        currentNode={this.currentNode}
        productOptions={this.productOutputs}
        change={this.changeDownstreamSupplier}
      />
    );
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
            disabled={this.isDisabled || this.isSubmitting}
            isLoading={this.isSubmitting}
            click={this.onSubmit}
          />
        </Styled.ButtonGroupEnd>
      </Styled.Actions>
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout title={this.title} closeModal={this.closeModal}>
        <Styled.Wrapper>
          {this.renderContent()}
          {this.renderActions()}
        </Styled.Wrapper>
      </modal-layout>
    );
  }
}
