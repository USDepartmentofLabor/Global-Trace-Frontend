/* eslint-disable max-lines */
import { Component, Watch, Vue } from 'vue-property-decorator';
import { flatMap, get, head, isEmpty, map } from 'lodash';
import { graph, Screen } from 'vnodes';
import productModule from 'store/modules/product';
import { getRoleList } from 'api/role';
import { RoleTypeEnum } from 'enums/role';
import supplyChain from 'store/modules/supply-chain';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import { DIAGRAM_SCREEN_CONFIG } from 'config/constants';
import Button from 'components/FormUI/Button';
import { isMobile } from 'utils/helpers';
import Unsupported from 'components/Unsupported';
import { SettingTabEnum } from 'enums/setting';
import * as Styled from './styled';
import SupplyChain from './SupplyChain';
import AddFlow from './AddFlow';

const SelectInitialRoleModal = () => import('modals/SelectInitialRoleModal');

@Component
export default class SupplyChainMapping extends Vue {
  public isLoading = true;
  private isDeletingNode = false;
  public abortController: AbortController = null;
  public roles: RoleAndPermission.Role[] = [];
  public graph = new graph();
  public edgeOptions = {
    fromAnchor: {
      y: '50%',
      snap: 'rect',
    },
    toAnchor: {
      y: '50%',
      snap: 'rect',
    },
  };

  get nodeOptions(): App.Any {
    return {
      width: 222,
      height: 60,
    };
  }

  @Watch('$route.query', { immediate: true, deep: true })
  onChangeQuery() {
    const tabName = get(this.$route.query, 'tabName');
    if (tabName == SettingTabEnum.SUPPLY_CHAIN_MAPPING && !this.isLoading) {
      this.initData();
    }
  }

  created() {
    this.initData();
  }

  async getSupplyChainMapping(isInit = false) {
    try {
      this.isLoading = true;
      supplyChain.getSupplyChainMapping({
        callback: {
          onSuccess: () => {
            this.createMapElements(isInit);
          },
        },
      });
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      if (!isInit) {
        this.isLoading = false;
      }
    }
  }

  resetImpactData() {
    supplyChain.resetImpactData();
  }

  setIsDeletingNode(value: boolean = true) {
    this.isDeletingNode = value;
  }

  handleDeletedNode() {
    this.resetImpactData();
    this.setIsDeletingNode(false);
  }

  createMapElements(fixContent: boolean = true): void {
    this.graph.reset();
    const nodes = flatMap(supplyChain.supplyChainMapping, 'nodes');
    const lines = flatMap(supplyChain.supplyChainMapping, 'lines');
    nodes.forEach((node) => {
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
    lines.forEach((line) => this.drawLine(line));
    if (fixContent) {
      setTimeout(() => {
        this.fitContent();
      });
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

  getFirstNodePosition(): SupplyChain.NodePosition {
    if (isEmpty(supplyChain.supplyChainMapping)) {
      return {
        left: 0,
        top: 0,
      };
    }
    let left = Infinity;
    let bottom = -Infinity;
    const nodes = this.graph.nodes;
    nodes.forEach((node: App.MapNode) => {
      if (node.x < left) {
        left = node.x;
      }
      if (node.y + node.height > bottom) {
        bottom = node.y + node.height;
      }
    });
    bottom += 10;
    return {
      left,
      top: bottom + 100,
    };
  }

  zoomNode(position: SupplyChain.NodePosition) {
    const left = position.left;
    const top = position.top + 300;
    const bottom = position.top;
    const right = position.left + 300;
    (this.$refs.screen as App.Any).zoomRect(
      { left, top, right, bottom },
      { scale: (this.$refs.screen as App.Any).panzoom.getZoom() },
    );
  }

  async initData(): Promise<void> {
    this.isLoading = true;
    await Promise.all([
      this.getRoles(),
      productModule.getProductList({
        callback: {
          onFailure: (error: App.ResponseError) => {
            handleError(error);
          },
        },
      }),
      this.getSupplyChainMapping(true),
    ]);
    this.isLoading = false;
  }

  async getRoles() {
    try {
      this.roles = await getRoleList({ type: RoleTypeEnum.PRODUCT });
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  handleAddFlow(): void {
    const position = this.getFirstNodePosition();
    this.$modal.show(
      SelectInitialRoleModal,
      {
        position,
        roles: this.roles,
        productOutputs: productModule.products,
        addedFlow: this.onAddedFlow,
      },
      { width: '640px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  async onAddedFlow(
    nodes: SupplyChain.Node[],
    callback: () => void,
  ): Promise<void> {
    try {
      await this.getSupplyChainMapping(false);
      callback();
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.$nextTick(() => {
        this.zoomNode(head(nodes).position);
      });
    }
  }

  createGraphNode(node: SupplyChain.Node): void {
    const { id, role } = node;
    this.graph.createNode({
      id,
      label: role.name,
      ...{
        x: node.position.left,
        y: node.position.top,
      },
      ...this.nodeOptions,
    });
  }

  renderEmpty(): JSX.Element {
    return (
      <Styled.EmptyContainer>
        <Styled.EmptyImage />
        <Styled.EmptyText>
          {this.$t('supply_chain_empty_message')}
        </Styled.EmptyText>
        <Button
          variant="primary"
          label={this.$t('select_initial_role')}
          icon="plus"
          click={this.handleAddFlow}
        />
      </Styled.EmptyContainer>
    );
  }

  renderMap() {
    return (
      <Styled.Screen>
        <Screen ref="screen" options={DIAGRAM_SCREEN_CONFIG}>
          <marker
            id="arrow-end-danger"
            orient="auto"
            markerWidth="6.5"
            markerHeight="6.5"
            refX="4.5"
            refY="2.5"
          >
            <path
              d="M0,0 L0,10 L10,5 L0,0"
              style="fill: #C04543;transform: scale(0.5);"
            ></path>
          </marker>
          {map(supplyChain.supplyChainMapping, (chain, index) => {
            const show =
              isEmpty(supplyChain.currentImpactChainId) ||
              chain.chainId === supplyChain.currentImpactChainId;
            return (
              show && (
                <SupplyChain
                  key={chain.chainId}
                  graph={this.graph}
                  roles={this.roles}
                  supplyChain={chain}
                  index={index}
                  isDeletingNode={this.isDeletingNode}
                  reload={() => {
                    this.getSupplyChainMapping(false);
                  }}
                  deletedNode={this.handleDeletedNode}
                />
              )
            );
          })}
        </Screen>
      </Styled.Screen>
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
    if (isEmpty(supplyChain.supplyChainMapping)) {
      return this.renderEmpty();
    }
    return (
      <Styled.Wrapper vOn:wheel={(e: Event) => e.stopPropagation()}>
        {this.renderMap()}
        {!supplyChain.currentImpactChainId && (
          <AddFlow
            roles={this.roles}
            getFirstNodePosition={this.getFirstNodePosition}
            productOutputs={productModule.products}
            addedFlow={this.onAddedFlow}
          />
        )}
        {supplyChain.currentImpactChainId && (
          <Styled.ImpactActions>
            <Button
              variant="transparentPrimary"
              label={this.$t('back')}
              disabled={this.isDeletingNode}
              click={this.resetImpactData}
            />
            <Button
              variant="danger"
              label={this.$t('yes_continue_anyway')}
              disabled={this.isDeletingNode}
              isLoading={this.isDeletingNode}
              click={() => {
                this.setIsDeletingNode();
              }}
            />
          </Styled.ImpactActions>
        )}
      </Styled.Wrapper>
    );
  }
}
