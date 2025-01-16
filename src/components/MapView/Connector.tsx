import { Vue, Component, Prop } from 'vue-property-decorator';
import themeStyled from 'styles/theme';

@Component
export default class Connector extends Vue {
  @Prop({ required: true }) readonly id: string;
  @Prop({ default: false }) readonly isActive: boolean;
  @Prop({ default: [] }) readonly selectIds: string[];
  @Prop({ required: true }) readonly startX: number;
  @Prop({ required: true }) readonly startY: number;
  @Prop({ required: true }) readonly endX: number;
  @Prop({ required: true }) readonly endY: number;

  get isSelect(): boolean {
    return this.selectIds.includes(this.id);
  }

  get strokerWidth(): number {
    return this.isSelect ? 3 : 1;
  }

  get strokeColor(): string {
    if (this.isSelect) {
      return themeStyled.colors.highland;
    }
    return this.isActive
      ? themeStyled.colors.envy
      : themeStyled.colors.surfCrest;
  }

  get lineStyle(): string {
    const stroke = `stroke: ${this.strokeColor}`;
    const strokeWidth = `stroke-width: ${this.strokerWidth}`;
    const styles = [stroke, strokeWidth];
    return styles.join(';');
  }

  render(): JSX.Element {
    return (
      <line
        x1={this.startX}
        y1={this.startY}
        x2={this.endX}
        y2={this.endY}
        style={this.lineStyle}
      />
    );
  }
}
