/* eslint-disable max-lines, max-lines-per-function */
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Screen, Node, Edge, graph, Label } from 'vnodes';
import { debounce, get, isEmpty } from 'lodash';
import productModule from 'store/modules/product';
import supplyChain from 'store/modules/supply-chain';
import Button from 'components/FormUI/Button/Button';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import SelectRolePopper from 'components/FormUI/SelectRolePopper';
import { isMobile } from 'utils/helpers';
import Unsupported from 'components/Unsupported';
import { getRoleList } from 'api/role';
import { SettingTabEnum } from 'enums/setting';
import {
  deleteSupplyChain,
  getSupplyChainMapping,
  updateSupplyChainNode,
} from 'api/supply-chain';
import { RoleTypeEnum } from 'enums/role';
import * as Styled from './styled';

const ConfirmModal = () => import('modals/ConfirmModal');

@Component
export default class SupplyChainMapping extends Vue {
  private roles: RoleAndPermission.Role[] = [];
  private supplyChainMapping: SupplyChain.SupplyChainMapping = null;
  private isLoading = true;
  private graph = new graph();
  private screenOptions = {
    center: true,
  };
  private nodeOptions = {
    width: 160,
    height: 100,
  };
  private edgeOptions = {
    fromAnchor: {
      y: '50%',
      snap: 'rect',
    },
    toAnchor: {
      y: '50%',
      snap: 'rect',
    },
  };
  private currentSelectedRole: RoleAndPermission.Role = null;
  private currentSelectedProduct: ProductManagement.Product = null;
  private abortController: AbortController = null;
  get currentSelectedRoleId(): string {
    return get(this.currentSelectedRole, 'id');
  }

  get currentSelectedProductId(): string {
    return get(this.currentSelectedProduct, 'id');
  }

  get roleOptions(): RoleAndPermission.Role[] {
    if (this.supplyChainMapping && !isEmpty(this.supplyChainMapping.nodes)) {
      return this.roles.filter(
        ({ id }) =>
          !this.supplyChainMapping.nodes.some(({ roleId }) => roleId === id),
      );
    }
    return this.roles;
  }

  get productOptions(): ProductManagement.Product[] {
    if (this.supplyChainMapping && !isEmpty(this.supplyChainMapping.nodes)) {
      return productModule.products.filter(
        ({ id }) =>
          !this.supplyChainMapping.nodes.some(
            ({ outputProductDefinitionId }) => outputProductDefinitionId === id,
          ),
      );
    }
    return productModule.products;
  }

  get selectedRoleIds(): string[] {
    return this.supplyChainMapping.nodes.map(({ roleId }) => roleId);
  }

  get selectedProductIds(): string[] {
    return this.supplyChainMapping.nodes.map(
      ({ outputProductDefinitionId }) => outputProductDefinitionId,
    );
  }

  get lineLabels(): SupplyChain.Line[] {
    return this.supplyChainMapping.lines.filter(
      ({ hasBrokerIcon }) => hasBrokerIcon,
    );
  }

  created() {
    this.initData();
    this.onDebouncedUpdate = debounce(this.onDebouncedUpdate, 300);
  }

  @Watch('$route.query', { immediate: true, deep: true })
  onChangeQuery() {
    const tabName = get(this.$route.query, 'tabName');
    if (tabName == SettingTabEnum.SUPPLY_CHAIN_MAPPING) {
      this.initData();
    }
  }

  async initData(): Promise<void> {
    this.isLoading = true;
    await Promise.all([
      this.getRoleList(),
      productModule.getProductList({
        callback: {
          onFailure: (error: App.ResponseError) => {
            handleError(error);
          },
        },
      }),
      this.getSupplyChainMapping(),
    ]);
    this.isLoading = false;
  }

  async getRoleList() {
    try {
      this.roles = await getRoleList({ type: RoleTypeEnum.PRODUCT });
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  async getSupplyChainMapping() {
    try {
      this.supplyChainMapping = await getSupplyChainMapping();
      this.graph.reset();
      this.supplyChainMapping.nodes.forEach((node) => {
        if (node) {
          this.graph.createNode({
            id: node.id,
            label: node.role.name,
            x: node.position.left,
            y: node.position.top,
            ...this.nodeOptions,
          });
        }
      });
      this.supplyChainMapping.lines.forEach((line) => this.drawLine(line));
      this.fitContent();
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  drawLine(line: SupplyChain.Line): void {
    const from = line.fromNodeId;
    const to = line.toNodeId;
    if (from && to) {
      this.graph.createEdge(from, to, this.edgeOptions);
    }
  }

  fitContent() {
    if (this.$refs.screen) {
      this.$nextTick(() => {
        (this.$refs.screen as App.Any).zoomNodes(this.graph.nodes, {
          scale: 1,
        });
      });
    }
  }

  getFromNodeTotal(roleId: string = null): number {
    if (roleId) {
      const fromNode = this.supplyChainMapping.nodes.filter(
        ({ fromRoleId }) => fromRoleId === roleId,
      );
      return fromNode.length;
    }
    return 0;
  }

  onCreateSupplyChainNode(fromRoleId: string = null): void {
    const fromNode = this.supplyChainMapping.nodes.find(
      ({ roleId }) => roleId === fromRoleId,
    );
    const bufferTop = this.getFromNodeTotal(fromRoleId) * 100;
    const position = {
      top: fromRoleId ? fromNode.position.top + bufferTop : 0,
      left: fromRoleId ? fromNode.position.left + 300 : 0,
    };
    const params: SupplyChain.NodeParams = {
      fromRoleId,
      position,
      roleId: this.currentSelectedRoleId,
      outputProductDefinitionId: this.currentSelectedProductId,
    };

    supplyChain.createSupplyChainNodes({
      params,
      callback: {
        onSuccess: (node: SupplyChain.Node) => {
          const role = this.roles.find(
            ({ id }) => id === this.currentSelectedRoleId,
          );
          const outputProductDefinition = productModule.products.find(
            ({ id }) => id === this.currentSelectedProductId,
          );
          this.supplyChainMapping.nodes.push({
            ...node,
            label: role.name,
            role,
            outputProductDefinition,
          });
          this.graph.createNode({
            id: node.id,
            label: role.name,
            ...{
              x: position.left,
              y: position.top,
            },
            ...this.nodeOptions,
          });
          if (fromRoleId) {
            this.graph.createEdge(fromNode.id, node.id, this.edgeOptions);
            this.supplyChainMapping.lines.push({
              fromNodeId: fromNode.id,
              hasBrokerIcon: get(node, 'hasBrokerIcon', false),
              toNodeId: node.id,
            });
          }
          this.resetRoleProductData();
        },
        onFailure: (error: App.ResponseError) => {
          handleError(error);
        },
      },
    });
  }

  onEditSupplyChainNode(supplyChainNode: SupplyChain.Node): void {
    const { roleId, role, outputProductDefinitionId, outputProductDefinition } =
      supplyChainNode;
    supplyChainNode.roleId = this.currentSelectedRoleId;
    const newRole = this.roles.find(
      ({ id }) => id === this.currentSelectedRoleId,
    );
    supplyChainNode.role = newRole;

    supplyChainNode.outputProductDefinitionId = this.currentSelectedProductId;
    const newProduct = productModule.products.find(
      ({ id }) => id === this.currentSelectedProductId,
    );
    supplyChainNode.outputProductDefinition = newProduct;

    this.onDebouncedUpdate(
      this.graph.nodes.find(
        (node: App.MapNode) => node.id === supplyChainNode.id,
      ),
      (isSuccess: boolean) => {
        if (!isSuccess) {
          supplyChainNode.roleId = roleId;
          supplyChainNode.role = role;
          supplyChainNode.outputProductDefinitionId = outputProductDefinitionId;
          supplyChainNode.outputProductDefinition = outputProductDefinition;
        }
      },
    );
  }

  initPopupData(supplyChainNode: SupplyChain.Node = null): void {
    this.selectRole(get(supplyChainNode, 'role', null));
    this.selectProduct(get(supplyChainNode, 'outputProductDefinition', null));
  }

  selectRole(role: RoleAndPermission.Role): void {
    this.currentSelectedRole = role;
  }

  selectProduct(product: ProductManagement.Product): void {
    this.currentSelectedProduct = product;
  }

  async onDelete(id: string): Promise<void> {
    try {
      await deleteSupplyChain(id);
      const currentNode = this.supplyChainMapping.nodes.find(
        (note) => note.id === id,
      );
      this.removeNode(currentNode);
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  async onConfirm(id: string): Promise<void> {
    await this.onDelete(id);
  }

  removeNode(node: SupplyChain.Node): void {
    this.removeRelatedLines(node);
    this.supplyChainMapping.nodes = this.supplyChainMapping.nodes.filter(
      (note) => note.id !== node.id,
    );
    this.graph.removeNode(
      this.graph.nodes.find((item: App.MapNode) => item.id === node.id),
    );
    this.removeRelatedNodes(get(node, 'roleId'));
  }

  removeRelatedLines(node: SupplyChain.Node): void {
    const edges = this.graph.edges.filter(
      ({ from, to }: { from: string; to: string }) =>
        from === node.id || to === node.id,
    );
    if (!isEmpty(edges)) {
      edges.forEach((edge: App.Any) => {
        this.graph.removeEdge(edge);
        this.supplyChainMapping.lines = this.supplyChainMapping.lines.filter(
          (line) => edge.from !== line.fromNodeId && edge.to !== line.toNodeId,
        );
      });
    }
  }

  removeRelatedNodes(fromRoleId: string): void {
    const relatedNodes = this.supplyChainMapping.nodes.filter(
      (note) => note.fromRoleId === fromRoleId,
    );
    relatedNodes.forEach((node) => {
      this.removeNode(node);
    });
  }

  showConfirmDeleteModal(nodeId: string): void {
    this.$modal.show(
      ConfirmModal,
      {
        icon: 'delete_forever',
        iconSize: '44',
        message: this.$t('delete_role_question'),
        note: this.$t('this_action_cannot_be_undone'),
        confirmLabel: this.$t('common.action.yes_delete'),
        confirmButtonVariant: 'danger',
        cancelLabel: this.$t('common.action.cancel'),
        onConfirm: () => this.onConfirm(nodeId),
      },
      { width: '336px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  getSupplyChainNode(node: App.MapNode): SupplyChain.Node {
    return this.supplyChainMapping.nodes.find(({ id }) => id === node.id);
  }

  onDebouncedUpdate(
    node: App.MapNode,
    callback: (isSuccess: boolean) => void = null,
  ): void {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.onUpdateNode(node, callback);
  }

  async onUpdateNode(
    node: App.MapNode,
    callback: (isSuccess: boolean) => void,
  ): Promise<void> {
    try {
      const {
        roleId,
        role,
        fromRoleId,
        outputProductDefinition,
        outputProductDefinitionId,
      } = this.getSupplyChainNode(node);
      this.abortController = new AbortController();
      const signal = this.abortController.signal;
      await updateSupplyChainNode(
        node.id,
        {
          roleId,
          fromRoleId,
          outputProductDefinitionId,
          position: {
            top: node.y,
            left: node.x,
          },
        },
        signal,
      );
      const nodeIndex = this.supplyChainMapping.nodes.findIndex(
        ({ id }) => id === node.id,
      );
      if (nodeIndex > -1) {
        this.supplyChainMapping.nodes[nodeIndex].position.top = node.y;
        this.supplyChainMapping.nodes[nodeIndex].position.left = node.x;
        this.supplyChainMapping.nodes[nodeIndex].role = role;
        this.supplyChainMapping.nodes[nodeIndex].outputProductDefinition =
          outputProductDefinition;
      }
      this.redrawLines();
      if (callback) {
        callback(true);
      }
    } catch (error) {
      if (error) {
        handleError(error as App.ResponseError);
      }
      this.abortController = null;
      if (callback) {
        callback(false);
      }
    }
    this.resetRoleProductData();
  }

  async redrawLines(): Promise<void> {
    const { lines } = await getSupplyChainMapping();
    this.graph.edges.forEach((edge: App.Any) => {
      this.graph.removeEdge(edge);
    });
    this.supplyChainMapping.lines = lines;
    lines.forEach((line) => this.drawLine(line));
  }

  // Docs: https://www.npmjs.com/package/v-tooltip#other-options
  getTooltipOptions(content: string): App.TooltipOptions {
    return {
      content: content,
      placement: 'top',
      classes: 'icon-tooltip',
      container: false,
    };
  }

  resetRoleProductData(): void {
    this.currentSelectedRole = null;
    this.currentSelectedProduct = null;
  }

  mounted() {
    this.graph.graphNodes();
    this.fitContent();
  }

  renderSelectRoleButton(fromNode: SupplyChain.Node = null): JSX.Element {
    return (
      <SelectRolePopper
        roles={this.roleOptions}
        products={this.productOptions}
        selectedRole={this.currentSelectedRole}
        selectedProduct={this.currentSelectedProduct}
        selectRole={this.selectRole}
        selectProduct={this.selectProduct}
        done={() => this.onCreateSupplyChainNode(get(fromNode, 'roleId', null))}
        show={() => this.initPopupData()}
      >
        <Button
          width="140px"
          label={
            fromNode ? this.$t('configure') : this.$t('select_a_first_role')
          }
        />
      </SelectRolePopper>
    );
  }

  renderEmpty(): JSX.Element {
    return (
      <Styled.EmptyContainer>
        <Styled.EmptyImage />
        <Styled.EmptyText>
          {this.$t('supply_chain_empty_message')}
        </Styled.EmptyText>
        {this.renderSelectRoleButton()}
      </Styled.EmptyContainer>
    );
  }

  renderNodeContent(node: App.MapNode): JSX.Element {
    const supplyChainNode = this.getSupplyChainNode(node);
    const label = get(supplyChainNode, 'role.name');
    return (
      <Styled.Node
        v-tooltip={this.getTooltipOptions(
          get(supplyChainNode, 'outputProductDefinition.name'),
        )}
      >
        <Styled.NodeHeader>
          <span title={label}>{label}</span>
          <SelectRolePopper
            isCreate={false}
            roles={this.roleOptions}
            products={this.productOptions}
            selectedRole={this.currentSelectedRole}
            selectedProduct={this.currentSelectedProduct}
            selectRole={this.selectRole}
            selectProduct={this.selectProduct}
            removeNode={() => {
              this.showConfirmDeleteModal(node.id);
            }}
            done={() => this.onEditSupplyChainNode(supplyChainNode)}
            show={() => {
              this.initPopupData(supplyChainNode);
            }}
          >
            <font-icon name="edit" size="20" color="highland" />
          </SelectRolePopper>
        </Styled.NodeHeader>
        {this.renderSelectRoleButton(supplyChainNode)}
      </Styled.Node>
    );
  }

  renderNode(node: App.MapNode): JSX.Element {
    return (
      <g>
        <Node
          data={node}
          margin={0}
          ref="node"
          width={this.nodeOptions.width}
          height={this.nodeOptions.height}
          vOn:drag={() => this.onDebouncedUpdate(node)}
        >
          {this.renderNodeContent(node)}
        </Node>
      </g>
    );
  }

  renderLabel(line: SupplyChain.Line): JSX.Element {
    const edge = this.graph.edges.find(
      ({ from, to }: { from: string; to: string }) =>
        from === line.fromNodeId && to === line.toNodeId,
    );
    return (
      edge && (
        <Label edge={edge}>
          <font-icon
            v-tooltip={this.getTooltipOptions(this.$t('intermediaries'))}
            name="broker"
            color="highland"
            size="20"
            title={this.$t('intermediaries')}
          />
        </Label>
      )
    );
  }

  render(): JSX.Element {
    if (isMobile()) {
      return <Unsupported />;
    }
    if (this.isLoading) {
      return (
        <Styled.EmptyContainer>
          <SpinLoading />
        </Styled.EmptyContainer>
      );
    }
    if (isEmpty(get(this.supplyChainMapping, 'nodes', []))) {
      return this.renderEmpty();
    }
    return (
      <Styled.Wrapper vOn:wheel={(e: Event) => e.stopPropagation()}>
        <Screen ref="screen" options={this.screenOptions}>
          {this.graph.edges.map((edge: App.Any) => (
            <Edge data={edge} key={edge.id} nodes={this.graph.nodes} />
          ))}
          {this.lineLabels.map(this.renderLabel)}
          {this.graph.nodes.map(this.renderNode)}
        </Screen>
      </Styled.Wrapper>
    );
  }
}
