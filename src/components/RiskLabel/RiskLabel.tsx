import { Vue, Component, Prop } from 'vue-property-decorator';
import * as Styled from './styled';

@Component
export default class RiskLabel extends Vue {
  @Prop({ default: '' }) text: string;
  @Prop({ default: '' }) level: string;
  @Prop({ default: 'inherit' }) width: string;
  @Prop({ default: true }) isUppercase: boolean;
  @Prop({ default: false }) hasDot: boolean;
  @Prop({
    default: 'row',
    validator(this, value) {
      return ['row', 'row-reverse', 'column', 'column-reverse'].includes(value);
    },
  })
  direction: string;

  render(): JSX.Element {
    return (
      <Styled.Wrapper direction={this.direction}>
        {this.hasDot && <Styled.Dot level={this.level} />}
        {this.text && (
          <Styled.Level
            isUppercase={this.isUppercase}
            width={this.width}
            level={this.level}
            hasDot={this.hasDot}
          >
            {this.text}
          </Styled.Level>
        )}
      </Styled.Wrapper>
    );
  }
}
