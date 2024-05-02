/* eslint-disable  max-lines-per-function */
import { Vue, Component, Prop } from 'vue-property-decorator';
import { graph, Label } from 'vnodes';
import { SUPPLIER_MAP_CONFIG } from 'config/constants';

@Component
export default class MapMixin extends Vue {
  @Prop({ default: null }) scale: number;
  @Prop({ default: SUPPLIER_MAP_CONFIG.DIRECTION }) direction: string;
  @Prop({
    default: () => {
      // TODO
    },
  })
  editSupplier: (supplier: BrandSupplier.SupplierItem, isEdit: boolean) => void;
  @Prop({
    default: () => {
      // TODO
    },
  })
  clickSupplier: (supplier: BrandSupplier.SupplierItem) => void;

  public graph = new graph();
  public screenOptions = {
    center: true,
  };
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
    nodes.forEach((node: App.Any) => {
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

  getTooltipOptions(content: string): App.TooltipOptions {
    return {
      content: content,
      placement: 'top',
      classes: 'icon-tooltip',
      container: false,
    };
  }

  renderLabel(line: BrandSupplier.Line): JSX.Element {
    const edge = this.graph.edges.find(
      ({ from, to }: { from: string; to: string }) =>
        from === line.fromNodeId && to === line.toNodeId,
    );
    return (
      edge && (
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
