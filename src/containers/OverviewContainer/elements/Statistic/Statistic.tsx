import { Vue, Component, Prop } from 'vue-property-decorator';
import { get } from 'lodash';
import { DATE_TIME_FORMAT } from 'config/constants';
import { formatDate } from 'utils/date';
import theme from 'styles/theme';
import TotalTransaction from './TotalTransaction';
import MassBalance from './MassBalance';
import * as Styled from './styled';

@Component
export default class Statistic extends Vue {
  @Prop({ required: false }) readonly isProductSegregation: boolean;
  @Prop({ required: true }) readonly hasViewMarginOfError: boolean;
  @Prop({ required: true }) readonly isLoadingMassBalance: boolean;
  @Prop({ required: true }) readonly isLoadingTotalTransaction: boolean;
  @Prop({ required: true }) readonly isLoadingMarginOfErrors: boolean;
  @Prop({ required: true }) readonly hasViewHistory: boolean;
  @Prop({ required: true })
  readonly totalTransaction: TransactionHistory.TotalTransactionResponse;
  @Prop({ required: true })
  readonly massBalance: TransactionHistory.MassBalanceResponse;
  @Prop({ required: true })
  readonly marginOfErrors: TransactionHistory.TransactionResponse;

  get canCalculateMarginOfErrors(): boolean {
    return get(this.marginOfErrors, 'canCalculate', false);
  }

  get marginOfErrorNumber(): number {
    return Math.abs(get(this.marginOfErrors, 'value', 0));
  }

  get total(): number {
    return (
      this.massBalance.verifiedQuantity + this.massBalance.notVerifiedQuantity
    );
  }

  get isShowMassBalance(): boolean {
    return this.hasViewHistory && !this.isProductSegregation;
  }

  get verifiedPercent(): number {
    const percent = (this.massBalance.verifiedQuantity * 100) / this.total;
    return Math.round(percent);
  }

  get notVerifiedPercent(): number {
    return 100 - this.verifiedPercent;
  }

  get isMarginWarning(): boolean {
    return this.marginOfErrorNumber > 3;
  }

  get marginOfErrorColor(): string {
    return this.isMarginWarning ? 'red' : 'stormGray';
  }

  get totalTransactions(): TransactionHistory.TotalTransaction[] {
    if (this.hasViewHistory) {
      return [
        {
          name: this.$t('total_inputs'),
          total: Math.trunc(this.totalTransaction.totalInputs.value),
          totalColor: theme.colors.stormGray,
          unit: this.$t('kg'),
          hasLoading: true,
          show: true,
        },
        {
          name: this.$t('total_outputs'),
          total: Math.trunc(this.totalTransaction.totalOutputs.value),
          totalColor: theme.colors.stormGray,
          unit: this.$t('kg'),
          hasLoading: true,
          show: true,
        },
        {
          name: this.$t('by_product'),
          total: Math.trunc(this.totalTransaction.totalByProduct.value),
          totalColor: theme.colors.stormGray,
          unit: this.$t('kg'),
          hasLoading: true,
          show: true,
        },
        {
          name: this.$t('margin_of_error'),
          total: Math.trunc(this.marginOfErrorNumber),
          totalColor: theme.colors[this.marginOfErrorColor],
          unit: '%',
          icon: this.isMarginWarning ? 'warning' : null,
          hasLoading: true,
          errorMessage:
            !this.canCalculateMarginOfErrors &&
            this.$t('cannot_calculate_margin_of_error'),
          show: !this.isProductSegregation && this.hasViewMarginOfError,
        },
      ];
    }

    return [];
  }

  get massBalancePercent(): TransactionHistory.MassBalancePercent {
    return {
      verifiedPercent: this.verifiedPercent,
      notVerifiedPercent: this.notVerifiedPercent,
    };
  }

  get massBalanceWeight(): TransactionHistory.MassBalanceWeight {
    return {
      verifiedWeight: this.massBalance.verifiedQuantity,
      notVerifiedWeight: this.massBalance.notVerifiedQuantity,
    };
  }

  get massBalanceData(): TransactionHistory.MassBalance {
    return {
      ...this.massBalancePercent,
      ...this.massBalanceWeight,
      total: this.total,
      canCalculate: this.massBalance.canCalculate,
      quantityUnit: this.massBalance.quantityUnit,
      updatedAt: this.massBalance.lastUpdatedAt
        ? formatDate(this.massBalance.lastUpdatedAt, DATE_TIME_FORMAT)
        : null,
    };
  }

  get statistics(): TransactionHistory.Statistic {
    return {
      totalTransactions: this.totalTransactions,
      massBalance: this.massBalanceData,
    };
  }

  renderStatisticCard(): JSX.Element {
    return (
      <fragment>
        {this.statistics.totalTransactions.map((totalTransaction) =>
          totalTransaction.show ? (
            <TotalTransaction
              isLoading={
                this.isLoadingTotalTransaction &&
                totalTransaction.hasLoading &&
                this.isLoadingMarginOfErrors
              }
              isShowMassBalance={this.isShowMassBalance}
              label={totalTransaction.name}
              total={totalTransaction.total}
              totalColor={totalTransaction.totalColor}
              icon={totalTransaction.icon}
              unit={totalTransaction.unit}
              errorMessage={totalTransaction.errorMessage}
            />
          ) : null,
        )}
      </fragment>
    );
  }

  renderMassBalance(): JSX.Element {
    if (this.isShowMassBalance) {
      return (
        <MassBalance
          isLoading={this.isLoadingMassBalance}
          massBalance={this.statistics.massBalance}
        />
      );
    }
    return null;
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        {this.renderStatisticCard()}
        {this.renderMassBalance()}
      </Styled.Wrapper>
    );
  }
}
