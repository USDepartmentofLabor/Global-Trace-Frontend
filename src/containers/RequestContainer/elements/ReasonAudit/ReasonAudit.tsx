import { Component, Prop, Vue } from 'vue-property-decorator';
import { ReasonEnum, SeverityEnum } from 'enums/auditor';
import * as Styled from './styled';

@Component
export default class ReasonAudit extends Vue {
  @Prop({ default: '' }) readonly reason: string;

  getReasonVariant(reason: string | number): string {
    switch (reason) {
      case ReasonEnum.HIGH_RISK_PROFILE:
        return 'danger';
      case ReasonEnum.MEDIUM_RISK_PROFILE:
        return 'warning';
      case SeverityEnum.HIGH:
        return 'danger';
      case SeverityEnum.MEDIUM:
        return 'warning';
      default:
        return 'mute';
    }
  }

  render(): JSX.Element {
    return (
      <Styled.Reason variant={this.getReasonVariant(this.reason)}>
        {this.reason}
      </Styled.Reason>
    );
  }
}
