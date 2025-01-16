import { Vue, Component, Prop } from 'vue-property-decorator';
import { maxBy } from 'lodash';
import Connector from './Connector';
import Block from './Block';

@Component
export default class MapView extends Vue {
  @Prop({ default: [] }) readonly blocks: MapView.Block[];
  @Prop({ default: [] }) readonly connectors: MapView.Connector[];
  @Prop({ default: [] }) readonly selectIds: string[];
  @Prop({ required: true }) readonly width: number;
  @Prop({ required: true }) readonly blockWidth: number;
  @Prop({ required: true }) readonly blockHeight: number;

  get bottomBlock(): MapView.Block {
    return maxBy(this.blocks, 'y');
  }

  get height(): number {
    return this.bottomBlock.y + this.blockHeight;
  }

  renderConnectors(): JSX.Element {
    return (
      <fragment>
        {this.connectors.reverse().map((connector) => (
          <Connector
            isActive={connector.isActive}
            id={connector.id}
            selectIds={this.selectIds}
            startX={connector.startX}
            startY={connector.startY}
            endX={connector.endX}
            endY={connector.endY}
          />
        ))}
      </fragment>
    );
  }

  renderBlocks(): JSX.Element {
    return (
      <fragment>
        {this.blocks.map((block) => (
          <Block
            x={block.x}
            y={block.y}
            width={this.blockWidth}
            height={this.blockHeight}
          >
            {this.$scopedSlots.blockContent(block.data)}
          </Block>
        ))}
      </fragment>
    );
  }

  render(): JSX.Element {
    return (
      <svg width={this.width} height={this.height}>
        {this.renderConnectors()}
        {this.renderBlocks()}
      </svg>
    );
  }
}
