import { Vue, Component, Prop } from 'vue-property-decorator';
import * as Styled from './styled';

@Component
export default class TableBody extends Vue {
  @Prop({ default: 1 }) readonly numberColumn: number;
  @Prop({ default: false }) readonly isLoading: boolean;
  @Prop({ default: 10 }) readonly numberRowLoading: number;
  @Prop({ default: false }) readonly hasAction: boolean;
  @Prop({ default: false }) readonly variant: boolean;

  get rows(): number[] {
    return new Array(this.numberRowLoading).fill(0).map((_, i) => i);
  }

  render(): JSX.Element {
    return (
      <Styled.TBody
        variant={this.variant}
        isLoading={this.isLoading}
        hasAction={this.hasAction}
      >
        {this.isLoading &&
          this.rows.map((row, idx) => (
            <Styled.Tr key={idx.toString()}>
              <Styled.Td colSpan={this.numberColumn}>
                <Styled.IconLoading />
                <Styled.LineLoading />
              </Styled.Td>
            </Styled.Tr>
          ))}
        {!this.isLoading && this.$slots.default}
      </Styled.TBody>
    );
  }
}
