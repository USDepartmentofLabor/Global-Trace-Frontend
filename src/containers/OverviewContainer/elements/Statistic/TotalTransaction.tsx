import { Vue, Component, Prop } from 'vue-property-decorator';
import { formatNumber } from 'utils/helpers';
import { SpinLoading } from 'components/Loaders';
import * as Styled from './styled';

@Component
export default class TotalTransaction extends Vue {
  @Prop({ required: true }) readonly isLoading: boolean;
  @Prop({ required: true }) readonly isShowMassBalance: boolean;
  @Prop({ default: '' }) readonly label: string;
  @Prop({ default: '' }) readonly icon: string;
  @Prop({ default: 'red' }) readonly iconColor: string;
  @Prop({ default: null }) readonly total: number;
  @Prop({ default: 'red' }) readonly totalColor: string;
  @Prop({ default: '%' }) readonly unit: string;
  @Prop({ default: null }) readonly errorMessage: string;

  get totalDisplayed(): string {
    return this.total > 0 ? formatNumber(this.total) : '-';
  }

  renderHeader(): JSX.Element {
    return (
      <Styled.Header>
        <Styled.Label>{this.label}</Styled.Label>
        {this.icon && (
          <font-icon name={this.icon} color={this.iconColor} size="20" />
        )}
      </Styled.Header>
    );
  }

  renderBody(): JSX.Element {
    if (this.isLoading) {
      return <SpinLoading />;
    }
    return (
      <Styled.Body>
        <Styled.Total color={this.totalColor}>
          {this.totalDisplayed}
        </Styled.Total>
        <Styled.Unit>{this.unit}</Styled.Unit>
      </Styled.Body>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.BoxWrapper
        direction="column"
        isShowMassBalance={this.isShowMassBalance}
      >
        {this.renderHeader()}
        {this.renderBody()}
        <Styled.Error>{this.errorMessage}</Styled.Error>
      </Styled.BoxWrapper>
    );
  }
}
