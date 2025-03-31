/* eslint-disable max-lines */
import { Vue, Component } from 'vue-property-decorator';
import moment from 'moment';
import { get, isEmpty, head } from 'lodash';
import {
  getMassBalance,
  getTotalTransaction,
  getCalculatorMarginOfError,
  getTransactionHistoryList,
  getSeasonStartTime,
} from 'api/transaction-history';
import { ChainOfCustodyEnum } from 'enums/role';
import { getUserFacility } from 'utils/user';
import { getUserInfo } from 'api/user-setting';
import {
  convertDateToTimestamp,
  currentTimestamp,
  formatDate,
  generateDateRange,
} from 'utils/date';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import auth from 'store/modules/auth';
import Statistic from './elements/Statistic';
import FilterBox from './elements/FilterBox';
import History from './elements/History';
import * as Styled from './styled';

@Component
export default class OverviewContainer extends Vue {
  private userInfo: Auth.User = null;
  private massBalance: TransactionHistory.MassBalanceResponse = {
    canCalculate: true,
    verifiedQuantity: 0,
    notVerifiedQuantity: 0,
    lastUpdatedAt: 0,
    quantityUnit: null,
  };
  private totalTransaction: TransactionHistory.TotalTransactionResponse = {
    totalInputs: {},
    totalOutputs: {},
    totalByProduct: {},
  };
  private marginOfErrors: TransactionHistory.TransactionResponse = {};
  private isLoading: boolean = false;
  private isLoadingTransactionList: boolean = false;
  private isLoadingMassBalance: boolean = false;
  private isLoadingTotalTransaction: boolean = false;
  private isLoadingMarginOfErrors: boolean = false;
  private now: number = moment().unix();
  private requestParams: TransactionHistory.RequestParams = {
    page: 1,
    perPage: 20,
    from: null,
    to: null,
  };
  private hasPagination: boolean = false;
  private pagination: App.Pagination = {
    total: 1,
    lastPage: 1,
    perPage: 20,
    currentPage: 1,
  };
  private transactions: TransactionHistory.History[] = [];
  private selectedDate: App.DropdownMenuOption = null;
  private seasonStartTime: TransactionHistory.SeasonStartTime = null;
  private selectedDateRange: Date[] = [];

  get dateOptions(): App.DropdownMenuOption[] {
    if (this.seasonStartTime && this.isMassBalance) {
      return this.massBalanceDates;
    }
    if (this.seasonStartTime && this.isProductSegregation) {
      return this.productSegregationDates;
    }
    return [];
  }

  get massBalanceDates(): App.DropdownMenuOption[] {
    const from = this.reconciliationStartAt;
    const to = currentTimestamp();
    const id = `${from}-${to}`;
    const fromFormatted = formatDate(from);
    const toFormatted = formatDate(to);
    return [
      {
        id,
        name: `${fromFormatted} - ${toFormatted}`,
      },
    ];
  }

  get productSegregationDates(): App.DropdownMenuOption[] {
    const startDate = moment(this.reconciliationStartAt * 1000).startOf('day');
    const dateRange = generateDateRange(startDate, {
      amount: this.reconciliationDuration,
      unit: 'months' as moment.unitOfTime.DurationConstructor,
    });
    return dateRange.reverse().map(({ from, to }) => {
      const id = `${from}-${to}`;
      const fromFormatted = formatDate(from);
      const toFormatted = formatDate(to);
      return {
        id: id,
        name: `${fromFormatted} - ${toFormatted}`,
      };
    });
  }

  get userFacility(): Auth.Facility {
    return getUserFacility(this.userInfo);
  }

  get isMassBalance(): boolean {
    return (
      get(this.userFacility, 'chainOfCustody') ===
      ChainOfCustodyEnum.MASS_BALANCE
    );
  }

  get isProductSegregation(): boolean {
    return (
      get(this.userInfo, 'role.chainOfCustody') ===
      ChainOfCustodyEnum.PRODUCT_SEGREGATION
    );
  }

  get reconciliationDuration(): number {
    return get(this.seasonStartTime, 'seasonDuration');
  }

  get reconciliationStartAt(): number {
    return get(this.seasonStartTime, 'seasonStartTime');
  }

  get totalTransactionRequestParams(): TransactionHistory.RequestParams {
    const { from, to } = this.requestParams;
    return {
      from: from || this.reconciliationStartAt,
      to: to || this.now,
    };
  }

  get massBalanceRequestParams(): TransactionHistory.RequestParams {
    return {
      from: this.reconciliationStartAt,
      to: this.now,
    };
  }

  get isEmptyTransactions(): boolean {
    return isEmpty(this.transactions);
  }

  created(): void {
    this.initData();
  }

  onSelectedDate(value: string = ''): void {
    this.setSelectedDate(value);
    this.setDateRequestParams(value);
    this.resetData();
  }

  setSelectedDate(value: string = ''): void {
    this.selectedDate = this.dateOptions.find((option) => option.id === value);
  }

  onSelectedDateRange(dateRange: Date[] = []): void {
    this.setSelectedDateRange(dateRange);
    this.setDateRangeRequestParams(dateRange);
    this.resetData();
  }

  setSelectedDateRange(dateRange: Date[] = []): void {
    this.selectedDateRange = dateRange;
  }

  resetData(): void {
    this.setPageRequestParams(1);
    this.resetPagination();
    this.getStatistic();
  }

  async initData(): Promise<void> {
    try {
      this.isLoading = true;
      await Promise.all([this.getUserInfo(), this.getSeasonStartTime()]);
      this.isLoading = false;
      this.setCircleDate();
      this.getStatistic();
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  getStatistic(): void {
    this.getTransactionHistoryList();
    if (auth.hasOverviewMenu) {
      this.getTotalTransaction();
      if (auth.hasViewMarginOfError) {
        this.getCalculatorMarginOfError();
      }
      if (this.isMassBalance) {
        this.getMassBalance();
      }
    }
  }

  setDateRequestParams(value: string): void {
    if (value) {
      const range = value.split('-');
      this.requestParams.from = parseInt(range[0], 10);
      this.requestParams.to = parseInt(range[1], 10);
    } else {
      this.requestParams.from = null;
      this.requestParams.to = null;
    }
  }

  setDateRangeRequestParams(dateRange: Date[]): void {
    if (isEmpty(dateRange)) {
      this.requestParams.from = null;
      this.requestParams.to = null;
    } else {
      this.requestParams.from = convertDateToTimestamp(dateRange[0]);
      this.requestParams.to = convertDateToTimestamp(dateRange[1]);
    }
  }

  resetFilter(): void {
    this.isMassBalance ? this.onSelectedDate() : this.onSelectedDateRange();
    this.resetData();
  }

  setCircleDate(): void {
    if (!isEmpty(this.dateOptions)) {
      this.setSelectedDate(head(this.dateOptions).id);
      this.setDateRequestParams(head(this.dateOptions).id);
    }
  }

  setTransactions(transactions: TransactionHistory.History[]): void {
    this.transactions = transactions;
  }

  async getUserInfo(): Promise<void> {
    try {
      const userInfo = await getUserInfo();
      this.userInfo = userInfo;
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  async getSeasonStartTime(): Promise<void> {
    try {
      this.seasonStartTime = await getSeasonStartTime();
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  async getTransactionHistoryList(): Promise<void> {
    try {
      this.isLoadingTransactionList = true;
      const { items, ...pagination } = await getTransactionHistoryList(
        this.requestParams,
      );
      this.setTransactions(items);
      this.hasPagination = items.length > 0;
      this.pagination = pagination;
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoadingTransactionList = false;
    }
  }

  async getTotalTransaction(): Promise<void> {
    try {
      this.isLoadingTotalTransaction = true;
      const { totalInputs, totalOutputs, totalByProduct } =
        await getTotalTransaction(this.totalTransactionRequestParams);
      this.totalTransaction.totalInputs = totalInputs;
      this.totalTransaction.totalOutputs = totalOutputs;
      this.totalTransaction.totalByProduct = totalByProduct;
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoadingTotalTransaction = false;
    }
  }

  async getCalculatorMarginOfError(): Promise<void> {
    try {
      this.isLoadingMarginOfErrors = true;
      const response = await getCalculatorMarginOfError(
        this.totalTransactionRequestParams,
      );
      this.marginOfErrors = response;
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoadingMarginOfErrors = false;
    }
  }

  async getMassBalance(): Promise<void> {
    try {
      this.isLoadingMassBalance = true;
      this.massBalance = await getMassBalance(
        this.totalTransactionRequestParams,
      );
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoadingMassBalance = false;
    }
  }

  changePage(page: number): void {
    this.setPageRequestParams(page);
    this.getTransactionHistoryList();
  }

  isPurchase(toFacilityId: string): boolean {
    return this.userFacility && this.userFacility.id === toFacilityId;
  }

  setPageRequestParams(page: number): void {
    this.requestParams.page = page;
  }

  resetPagination(): void {
    this.pagination.currentPage = 1;
  }

  renderFilterBox(): JSX.Element {
    return (
      <FilterBox
        isMassBalance={this.isMassBalance}
        dateOptions={this.dateOptions}
        selectedDate={this.selectedDate}
        selectedDateRange={this.selectedDateRange}
        changeDate={this.onSelectedDate}
        changeDateRange={this.onSelectedDateRange}
        reset={this.resetFilter}
      />
    );
  }

  renderStatistic(): JSX.Element {
    return (
      <Statistic
        isProductSegregation={this.isProductSegregation}
        hasViewHistory={auth.hasOverviewMenu}
        hasViewMarginOfError={auth.hasViewMarginOfError}
        isLoadingTotalTransaction={this.isLoadingTotalTransaction}
        isLoadingMassBalance={this.isLoadingMassBalance}
        isLoadingMarginOfErrors={this.isLoadingMarginOfErrors}
        massBalance={this.massBalance}
        totalTransaction={this.totalTransaction}
        marginOfErrors={this.marginOfErrors}
      />
    );
  }

  renderEmptyTransaction(): JSX.Element {
    if (!this.isLoadingTransactionList) {
      return (
        <Styled.EmptyContainer>
          <Styled.EmptyImage />
          <Styled.EmptyText>{this.$t('no_transaction')}</Styled.EmptyText>
        </Styled.EmptyContainer>
      );
    }
  }

  renderTable(): JSX.Element {
    return (
      <History
        transactions={this.transactions}
        isLoadingTransactionList={this.isLoadingTransactionList}
        hasPagination={this.hasPagination}
        pagination={this.pagination}
        changePage={this.changePage}
      />
    );
  }

  renderContent(): JSX.Element {
    if (this.isLoading) {
      return (
        <Styled.EmptyContainer>
          <SpinLoading />
        </Styled.EmptyContainer>
      );
    }
    return (
      <fragment>
        {this.renderFilterBox()}
        {this.renderStatistic()}
        {this.isEmptyTransactions
          ? this.renderEmptyTransaction()
          : this.renderTable()}
      </fragment>
    );
  }

  render(): JSX.Element {
    return (
      <dashboard-layout>
        <Styled.Wrapper>
          <Styled.Title>{this.$t('sidebar.overview')}</Styled.Title>
          <Styled.Container>{this.renderContent()}</Styled.Container>
        </Styled.Wrapper>
      </dashboard-layout>
    );
  }
}
