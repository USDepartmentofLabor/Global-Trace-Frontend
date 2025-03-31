import { Vue, Component, Prop } from 'vue-property-decorator';
import * as Styled from './styled';

@Component
export default class SpinLoading extends Vue {
  @Prop({ default: null }) readonly size: number;
  @Prop({ default: 'stormGray' }) readonly color: string;
  @Prop({ default: true }) readonly isInline: boolean;

  render(): JSX.Element {
    return (
      <Styled.Wrapper isInline={this.isInline}>
        <Styled.SpinLoading
          size={this.size}
          color={({ theme }: { theme: ThemeContext.Theme }) =>
            theme.colors[this.color]
          }
        />
      </Styled.Wrapper>
    );
  }
}
