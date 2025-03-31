import { Vue, Component, Prop } from 'vue-property-decorator';
import { LevelRiskCategoryEnum } from 'enums/saq';
import * as Styled from './styled';

@Component
export default class RiskAssessment extends Vue {
  @Prop({ required: true }) status: LevelRiskCategoryEnum;
  @Prop({ default: false }) isBar: boolean;
  @Prop({ default: '100%' }) width: string;

  render(): JSX.Element {
    const boxes = Array.from({ length: 4 });
    if (this.isBar) {
      return (
        <Styled.RiskAssessmentBar status={this.status} width={this.width}>
          {boxes.map(() => (
            <Styled.Box />
          ))}
        </Styled.RiskAssessmentBar>
      );
    }
    return <Styled.RiskAssessment status={this.status} />;
  }
}
