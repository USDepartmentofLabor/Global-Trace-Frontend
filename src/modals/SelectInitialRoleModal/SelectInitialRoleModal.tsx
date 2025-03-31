import { Vue, Component, Prop } from 'vue-property-decorator';
import { flatMap, has, isEmpty, orderBy } from 'lodash';
import InputGroup from 'components/FormUI/InputGroup';
import Dropdown from 'components/FormUI/Dropdown';
import Button from 'components/FormUI/Button';
import supplyChain from 'store/modules/supply-chain';
import { createSupplyChainNodes } from 'api/supply-chain';
import { handleError } from 'components/Toast';
import * as Styled from './styled';

@Component
export default class SelectInitialRoleModal extends Vue {
  @Prop({ required: true }) roles: RoleAndPermission.Role[];
  @Prop({ required: true }) productOutputs: ProductManagement.Product[];
  @Prop({ required: true }) position: SupplyChain.NodePosition;
  @Prop({ required: true }) addedFlow: (
    nodes: SupplyChain.Node[],
    callback: () => void,
  ) => void;

  private selectedRole: App.DropdownOption = null;
  private selectedProductOutputs: App.DropdownOption[] = [];
  private isSubmitting: boolean = false;

  get roleOptions(): App.DropdownOption[] {
    return orderBy(
      this.roles.filter(
        ({ id, isRawMaterialExtractor }) =>
          !this.chainIds.includes(id) && isRawMaterialExtractor,
      ),
      [(item) => item.name.toLowerCase()],
      'asc',
    );
  }

  get outputProductsOptions(): ProductManagement.Product[] {
    return orderBy(
      this.productOutputs,
      [(item) => item.name.toLowerCase()],
      'asc',
    );
  }

  get chainIds(): string[] {
    let ids: string[] = [];
    supplyChain.supplyChainMapping.forEach(({ lines }) => {
      const firstNodes = lines.filter((line) => !has(line, 'fromNodeId'));
      if (!isEmpty(firstNodes)) {
        ids = [...ids, ...flatMap(firstNodes, 'relation.roleId')];
      }
    });
    return ids;
  }

  get disabled(): boolean {
    return isEmpty(this.selectedRole) || isEmpty(this.selectedProductOutputs);
  }

  closeModal(): void {
    this.$emit('close');
  }

  handleSelectRole(value: App.DropdownOption): void {
    this.selectedRole = value;
  }

  handleSelectProduct(value: App.DropdownOption[]): void {
    this.selectedProductOutputs = value;
  }

  async createNode() {
    const roleId = this.selectedRole.id as string;
    const params: SupplyChain.SupplyChainNodesParams = {
      supplyChainNodes: [
        {
          roleId,
          chainId: null,
          fromRoleId: null,
          outputProductDefinitionIds: flatMap(
            this.selectedProductOutputs,
            'id',
          ),
          position: this.position,
        },
      ],
    };
    try {
      this.isSubmitting = true;
      let response = await createSupplyChainNodes(params);
      response = response.map((item) => {
        item.id = item.supplyChainNodeMetadataId;
        return item;
      });
      this.addedFlow(response, () => {
        this.closeModal();
        this.isSubmitting = false;
      });
    } catch (error) {
      if (error) {
        handleError(error as App.ResponseError);
      }
    }
  }

  renderActions(): JSX.Element {
    return (
      <Styled.Actions>
        <Button
          label={this.$t('common.action.cancel')}
          variant="transparentPrimary"
          click={this.closeModal}
          disabled={this.isSubmitting}
        />
        <Button
          variant="primary"
          label={this.$t('common.action.select')}
          disabled={this.disabled}
          isLoading={this.isSubmitting}
          click={this.createNode}
        />
      </Styled.Actions>
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout
        title={this.$t('select_initial_role')}
        showCloseIcon
        closeModal={this.closeModal}
      >
        <Styled.Wrapper>
          <InputGroup>
            <Dropdown
              options={this.roleOptions}
              value={this.selectedRole}
              title={this.$t('select_role')}
              placeholder={this.$t('select_role')}
              trackBy="id"
              allowEmpty={false}
              changeOptionValue={this.handleSelectRole}
              overflow
            />
            <Dropdown
              options={this.outputProductsOptions}
              value={this.selectedProductOutputs}
              title={this.$t('select_output_product')}
              placeholder={this.$t('select_output_product')}
              trackBy="id"
              allowEmpty={false}
              changeOptionValue={this.handleSelectProduct}
              overflow
              isMultiple
              limit={1}
              taggable
            />
          </InputGroup>

          {this.renderActions()}
        </Styled.Wrapper>
      </modal-layout>
    );
  }
}
