import { Vue, Component, Prop } from 'vue-property-decorator';
import { formatNumber } from 'utils/helpers';
import DonutChart from 'components/Chart/DonutChart';
import { SpinLoading } from 'components/Loaders';
import * as Styled from './styled';

@Component
export default class MassBalance extends Vue {
  @Prop({ required: true }) readonly isLoading: boolean;
  @Prop({ required: true })
  readonly massBalance: TransactionHistory.MassBalance;

  get donutData(): App.DonutData[] {
    const data = [
      {
        value: this.massBalance.verifiedPercent,
        color: 'envy',
      },
      {
        value: this.massBalance.notVerifiedPercent,
        color: 'sandyBrown',
      },
    ];
    return data.filter((item) => item.value > 0);
  }

  get hasData(): boolean {
    return this.massBalance.total > 0;
  }

  get quantityUnit(): string {
    return this.massBalance.quantityUnit;
  }

  get verifiedDisplayed(): string {
    return formatNumber(Math.trunc(this.massBalance.verifiedWeight));
  }

  get totalDisplayed(): string {
    return formatNumber(Math.trunc(this.massBalance.total));
  }

  get verifiedPercentDisplayed(): string {
    return this.hasData ? `${this.massBalance.verifiedPercent}%` : '- %';
  }

  get notVerifiedPercentDisplayed(): string {
    return this.hasData ? `${this.massBalance.notVerifiedPercent}%` : '- %';
  }

  renderInfo(): JSX.Element {
    return (
      <Styled.MassBalanceInfo>
        <Styled.MassBalanceDetail>
          <Styled.MassBalance>
            <Styled.Text dotColor="envy">{this.$t('verified')}</Styled.Text>
            <Styled.Strong>{this.verifiedPercentDisplayed}</Styled.Strong>
          </Styled.MassBalance>
          <Styled.MassBalance>
            <Styled.Text dotColor="sandyBrown">
              {this.$t('not_verified')}
            </Styled.Text>
            <Styled.Strong>{this.notVerifiedPercentDisplayed}</Styled.Strong>
          </Styled.MassBalance>
        </Styled.MassBalanceDetail>
      </Styled.MassBalanceInfo>
    );
  }

  renderChart(): JSX.Element {
    if (this.isLoading) {
      return <SpinLoading />;
    }
    return (
      <Styled.Chart>
        {this.hasData && <DonutChart data={this.donutData} />}
        {!this.hasData && <Styled.EmptyChart />}
      </Styled.Chart>
    );
  }

  renderDetail(): JSX.Element {
    return (
      <Styled.MassBalanceContent>
        {this.hasData && (
          <Styled.Verified>
            {this.$t('verified_item', {
              from: this.verifiedDisplayed,
              to: this.totalDisplayed,
              unit: this.quantityUnit,
            })}
          </Styled.Verified>
        )}
        {!this.hasData && (
          <text-direction>{this.$t('verified_default')}</text-direction>
        )}
        {this.massBalance.updatedAt && (
          <Styled.LastUpdate>
            {this.$t('last_update')}: {this.massBalance.updatedAt}
          </Styled.LastUpdate>
        )}
      </Styled.MassBalanceContent>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.BoxWrapper direction="column">
        <Styled.MassBalanceContainer>
          <Styled.Label>{this.$t('mass_balance')}</Styled.Label>
          {this.renderDetail()}
          {this.renderChart()}
          {this.renderInfo()}
        </Styled.MassBalanceContainer>
        {!this.massBalance.canCalculate && (
          <Styled.Error>
            {this.$t('cannot_calculate_mass_balance')}
          </Styled.Error>
        )}
      </Styled.BoxWrapper>
    );
  }
}
