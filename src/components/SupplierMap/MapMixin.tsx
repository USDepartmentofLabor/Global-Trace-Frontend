/* eslint-disable  max-lines-per-function */
import { Vue, Component, Prop } from 'vue-property-decorator';
import { flatMap } from 'lodash';
import { graph, Label } from 'vnodes';
import {
  DIAGRAM_SCREEN_CONFIG,
  NODE_SPACE_TIER,
  NODE_SPACE_X,
  NODE_WIDTH,
  SUPPLIER_MAP_CONFIG,
  SUPPLIER_SPLIT_CODE,
} from 'config/constants';
import * as Styled from './styled';

@Component
export default class MapMixin extends Vue {
  @Prop({ default: [] }) tiers: Array<SupplyChain.SupplyChainTier[]>;
  @Prop({ default: null }) scale: number;
  @Prop({ default: SUPPLIER_MAP_CONFIG.DIRECTION }) direction: string;
  @Prop({
    default: () => {
      // TODO
    },
  })
  editSupplier: (
    supplier: BrandSupplier.SupplierItem | BrandSupplier.TraceSupplierMapGroup,
    isEdit: boolean,
  ) => void;
  @Prop({
    default: () => {
      // TODO
    },
  })
  clickSupplier: (
    supplier: BrandSupplier.SupplierItem | BrandSupplier.TraceSupplierMapGroup,
  ) => void;

  public graph = new graph();
  public screenOptions = DIAGRAM_SCREEN_CONFIG;
  public edgeOptions = {
    fromAnchor: {
      x: '50%',
      y: '50%',
      snap: 'rect',
    },
    toAnchor: {
      x: '50%',
      y: '50%',
      snap: 'rect',
    },
  };
  public marginTop = NODE_SPACE_TIER;

  drawLine(line: BrandSupplier.Line): void {
    const from = line.fromNodeId;
    const to = line.toNodeId;
    if (from && to) {
      this.graph.createEdge(from, to, this.edgeOptions);
    }
  }

  fitContent(enable = true) {
    if (this.$refs.screen) {
      this.$nextTick(() => {
        if (enable) {
          this.graph.graphNodes({
            nodes: this.graph.nodes,
            edges: this.graph.edges,
            type: SUPPLIER_MAP_CONFIG.TYPE,
            dir: this.direction,
          });
        }
        this.zoomNodes(this.scale);
      });
    }
  }

  zoomNodes(scale: number = null) {
    let left = Infinity;
    let top = Infinity;
    let right = -Infinity;
    let bottom = -Infinity;

    const nodes = this.graph.nodes;
    nodes.forEach((node: App.MapNode) => {
      if (node.x < left) left = node.x;
      if (node.x + node.width > right) right = node.x + node.width;
      if (node.y < top) top = node.y;
      if (node.y + node.height > bottom) bottom = node.y + node.height;
    });

    left -= 10;
    top -= 10;
    right += 10;
    bottom += 10;
    (this.$refs.screen as App.Any).zoomRect(
      { left, top, right, bottom },
      { scale },
    );
  }

  isExistInTiers(type: string): boolean {
    return this.tiers.some((tierGroup) => {
      const names = flatMap(tierGroup, 'name');
      return names.some((name) =>
        name
          .toLowerCase()
          .split(SUPPLIER_SPLIT_CODE)
          .includes(type.toLowerCase()),
      );
    });
  }

  convertTiersToNodes():
    | BrandSupplier.SupplierItem[]
    | BrandSupplier.TraceSupplierMapGroup[] {
    return this.tiers.map((tierGroup, index) => {
      const id = flatMap(tierGroup, 'id').join();
      const name = flatMap(tierGroup, 'name').join(SUPPLIER_SPLIT_CODE);
      return {
        id,
        name,
        icon: null,
        isRoot: false,
        isTier: true,
        isExpanded: false,
        label: name,
        x: (NODE_WIDTH.MEDIUM + NODE_SPACE_X) * index,
        y: 0,
        targets: [],
        parents: [],
        childrens: [],
      };
    });
  }

  getTooltipOptions(content: string): App.TooltipOptions {
    return {
      content: content,
      placement: 'top',
      classes: 'icon-tooltip',
      container: false,
    };
  }

  renderTier(node: App.MapNode, params: App.MapNodeParams): JSX.Element {
    const lastTier = this.tiers[this.tiers.length - 1];
    const showConnector = flatMap(lastTier, 'id').join() !== node.id;
    return (
      <Styled.Tier
        v-tooltip={this.getTooltipOptions(node.label)}
        height={params.isExpand ? params.height : null}
        showConnector={showConnector}
      >
        <Styled.TierName isExpand={params.isExpand}>
          {node.label}
        </Styled.TierName>
      </Styled.Tier>
    );
  }

  renderLabel(line: BrandSupplier.Line): JSX.Element {
    const edge = this.graph.edges.find(
      ({ from, to }: { from: string; to: string }) =>
        from === line.fromNodeId && to === line.toNodeId,
    );
    const fromNode = this.graph.nodes.find(
      ({ id }: { id: string }) => id === line.fromNodeId,
    );
    const toNode = this.graph.nodes.find(
      ({ id }: { id: string }) => id === line.toNodeId,
    );
    const show =
      fromNode &&
      toNode &&
      toNode.isExpanded &&
      fromNode.parentsTotal > 0 &&
      (toNode.isRoot || toNode.parentsTotal > 0);
    return (
      show && (
        <Label edge={edge}>
          <font-icon
            name="broker"
            color="highland"
            size="20"
            title={this.$t('intermediaries')}
          />
        </Label>
      )
    );
  }
}
