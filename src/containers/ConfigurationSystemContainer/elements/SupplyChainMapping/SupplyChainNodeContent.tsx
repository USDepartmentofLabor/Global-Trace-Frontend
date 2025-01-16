import { Component, Prop, Vue } from 'vue-property-decorator';
import { filter, flatMap, get, isEmpty, isNull } from 'lodash';
import { getCategoryName } from 'utils/translation';
import { SupplyChainNodeActionEnum } from 'enums/setting';
import productModule from 'store/modules/product';
import supplyChain from 'store/modules/supply-chain';
import { DEFAULT_ROLE_ICON } from 'config/constants';
import * as Styled from './styled';
import { getTooltipOptions } from './supply-chain-mapping-helpers';

const AddDownstreamSupplierModal = () =>
  import('modals/AddDownstreamSupplierModal');
const EditDownstreamSupplierModal = () =>
  import('modals/EditDownstreamSupplierModal');
const EditCalculatedFieldModal = () =>
  import('modals/EditCalculatedFieldModal');
const EditOutputProductModal = () => import('modals/EditOutputProductModal');

@Component
export default class SupplyChainNodeContent extends Vue {
  @Prop({ required: true }) supplyChain: SupplyChain.SupplyChainMapping;
  @Prop({ required: true }) node: App.MapNode;
  @Prop({ required: true }) roleOptions: RoleAndPermission.Role[];
  @Prop({ required: true }) productOptions: ProductManagement.Product[];
  @Prop({ required: true }) removeNodes: (nodeIds: string[]) => void;
  @Prop({ required: true }) removeRelations: (relationIds: string[]) => void;
  @Prop({ required: true }) reload: () => void;
  @Prop({ required: true }) saveCalculatedField: (
    newNodeId: string,
    data: SupplyChain.Calculator,
    isUpdate: boolean,
  ) => void;
  get chainId(): string {
    return get(this.supplyChain, 'chainId');
  }

  get isShowingImpact() {
    return !isEmpty(supplyChain.currentImpactChainId);
  }

  get isDeleted() {
    return supplyChain.currentImpactData?.deletedNodeIds.includes(
      this.supplyChainNode.id,
    );
  }

  get isImpact() {
    return supplyChain.currentImpactData?.impactNodeIds.includes(
      this.supplyChainNode.id,
    );
  }

  get icon(): string {
    if (this.isShowingImpact) {
      if (this.isDeleted) {
        return 'remove';
      }
      if (this.isImpact) {
        return 'warning';
      }
    }
    return get(this.supplyChainNode, 'role.icon') || DEFAULT_ROLE_ICON;
  }

  get variant(): string {
    if (this.isDeleted) {
      return 'danger';
    }
    if (this.isImpact) {
      return 'warning';
    }
    return 'default';
  }

  get nodeOptions(): App.DropdownMenuOption[] {
    const hasFromNode = this.supplyChain.lines.some(
      ({ fromNodeId }) => fromNodeId === this.node.id,
    );
    const hasToNode = this.supplyChain.lines.some(
      ({ fromNodeId, toNodeId }) => fromNodeId && toNodeId === this.node.id,
    );
    const options = [
      {
        id: SupplyChainNodeActionEnum.ADD,
        icon: 'plus',
        name: this.$t('add_downstream_supplier'),
      },
      hasFromNode
        ? {
            id: SupplyChainNodeActionEnum.EDIT_DOWNSTREAM_SUPPLIER,
            icon: 'TreeView',
            name: this.$t('edit_downstream_suppliers'),
          }
        : null,
      hasToNode
        ? {
            id: SupplyChainNodeActionEnum.EDIT_CALCULATED_FIELD,
            icon: 'edit_alt',
            name: this.$t('edit_calculated_field'),
          }
        : null,
      {
        id: SupplyChainNodeActionEnum.EDIT_OUTPUT_PRODUCT,
        icon: 'edit',
        name: this.$t('edit_product_outputs'),
      },
      {
        id: SupplyChainNodeActionEnum.DELETE,
        icon: 'delete',
        name: this.$t('delete'),
      },
    ];
    return filter(options, (item) => !isNull(item));
  }

  get supplyChainNode(): SupplyChain.Node {
    return this.supplyChain.nodes.find(({ id }) => id === this.node.id);
  }

  selectAction(option: App.DropdownMenuOption) {
    switch (option.id) {
      case SupplyChainNodeActionEnum.ADD:
        this.handleAdd();
        break;

      case SupplyChainNodeActionEnum.EDIT_DOWNSTREAM_SUPPLIER:
        this.handleDownstreamSupplier();
        break;

      case SupplyChainNodeActionEnum.EDIT_CALCULATED_FIELD:
        this.handleEditCalculatedField();
        break;

      case SupplyChainNodeActionEnum.EDIT_OUTPUT_PRODUCT:
        this.handleEditOutputProduct();
        break;

      case SupplyChainNodeActionEnum.DELETE:
        this.removeNodes([this.supplyChainNode.id]);
        break;
    }
  }

  handleAdd() {
    this.$modal.show(
      AddDownstreamSupplierModal,
      {
        chainId: this.chainId,
        supplyChain: this.supplyChain,
        currentNode: this.supplyChainNode,
        roleOptions: this.roleOptions,
        productOptions: this.productOptions,
        onSuccess: this.reload,
        addedCalculatedField: (
          nodeId: string,
          data: SupplyChain.Calculator,
        ) => {
          this.saveCalculatedField(nodeId, data, false);
        },
      },
      { width: '640px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  handleDownstreamSupplier() {
    this.$modal.show(
      EditDownstreamSupplierModal,
      {
        currentNode: this.supplyChainNode,
        supplyChain: this.supplyChain,
        onSuccess: this.removeRelations,
      },
      { width: '640px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  handleEditCalculatedField() {
    this.$modal.show(
      EditCalculatedFieldModal,
      {
        chainId: this.chainId,
        supplyChain: this.supplyChain,
        currentNode: this.supplyChainNode,
        roleOptions: this.roleOptions,
        productOptions: this.productOptions,
        success: this.saveCalculatedField,
      },
      { width: '640px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  handleEditOutputProduct() {
    this.$modal.show(
      EditOutputProductModal,
      {
        chainId: this.chainId,
        supplyChain: this.supplyChain,
        currentNode: this.supplyChainNode,
        reload: this.reload,
      },
      { width: '640px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  getNodeTooltipContent(): string {
    if (!this.isShowingImpact) {
      const productIds = get(
        this.supplyChainNode,
        'outputProductDefinitionIds',
      );
      const products = productModule.products.filter(({ id }) =>
        productIds.includes(id),
      );
      return flatMap(products, (product) =>
        getCategoryName(get(product, 'name'), get(product, 'nameTranslation')),
      ).join(',');
    }
    if (this.isImpact) {
      return this.$t('calculated_field_will_be_deleted');
    } else if (this.isDeleted) {
      return this.$t('this_node_will_be_deleted');
    }
  }

  renderOption(option: App.DropdownMenuOption): JSX.Element {
    return (
      <Styled.Option vOn:click={() => this.selectAction(option)}>
        <font-icon name={option.icon} color="manatee" size="18" />
        {option.name}
      </Styled.Option>
    );
  }

  renderActions(): JSX.Element {
    return (
      <Styled.Options slot="popover">
        {this.nodeOptions.map((item) => this.renderOption(item))}
      </Styled.Options>
    );
  }

  renderIcon(): JSX.Element {
    const color = this.variant === 'default' ? 'highland' : 'white';
    return (
      <Styled.NodeIcon variant={this.variant}>
        <font-icon name={this.icon} size="20" color={color} />
      </Styled.NodeIcon>
    );
  }

  render(): JSX.Element {
    const label = get(this.supplyChainNode, 'role.name');
    return (
      <Styled.Node v-tooltip={getTooltipOptions(this.getNodeTooltipContent())}>
        <Styled.NodeHeader>
          {this.renderIcon()}
          <Styled.NodeName title={label}>{label}</Styled.NodeName>
          {!this.isShowingImpact && (
            <v-popover
              trigger="click"
              placement="bottom-start"
              container="body"
              autoHide
              ref="popper"
            >
              <font-icon name="more" size="20" color="highland" />
              {this.renderActions()}
            </v-popover>
          )}
        </Styled.NodeHeader>
      </Styled.Node>
    );
  }
}
