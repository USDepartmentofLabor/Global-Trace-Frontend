import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Block extends Vue {
  @Prop({ required: true }) readonly x: number;
  @Prop({ required: true }) readonly y: number;
  @Prop({ required: true }) readonly width: number;
  @Prop({ required: true }) readonly height: number;

  get transform(): string {
    return `translate(${this.x}, ${this.y})`;
  }

  render(): JSX.Element {
    return (
      <g transform={this.transform}>
        <foreignObject width={this.width} height={this.height}>
          {this.$slots.default}
        </foreignObject>
      </g>
    );
  }
}
