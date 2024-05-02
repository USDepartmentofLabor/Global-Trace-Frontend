import { Vue, Component, Prop } from 'vue-property-decorator';
import * as Styled from './styled';

@Component
export default class RiskLabel extends Vue {
  @Prop({ default: '' }) text: string;
  @Prop({ default: '' }) level: string;
  @Prop({ default: 'inherit' }) width: string;
  @Prop({ default: true }) isUppercase: boolean;

  render(): JSX.Element {
    return (
      <Styled.Level
        isUppercase={this.isUppercase}
        width={this.width}
        level={this.level}
      >
        {this.text}
      </Styled.Level>
    );
  }
}
