/* eslint-disable max-lines */
import { Vue, Component, Ref } from 'vue-property-decorator';
import { get, head, isArray, isEmpty } from 'lodash';
import { SortType } from 'enums/app';
import { formatDate } from 'utils/date';
import { handleError } from 'components/Toast';
import requestModule from 'store/modules/request';
import auth from 'store/modules/auth';
import DataTable from 'components/DataTable';
import { SpinLoading } from 'components/Loaders';
import Button from 'components/FormUI/Button';
import DashboardLayout from 'components/Layout/DashboardLayout';
import { PriorityEnum, ReportStatusEnum } from 'enums/auditor';
import { getGrievanceReportDetail } from 'api/grievance-report';
import RequestPanel from './elements/RequestPanel';
import * as Styled from './styled';
import IndicatorAndSubIndicator from './elements/IndicatorAndSubIndicator';

const CommunityRiskScanModal = () => import('modals/CommunityRiskScanModal');

@Component
export default class RequestContainer extends Vue {
  @Ref('dashboardLayout')
  readonly dashboardLayout!: DashboardLayout;

  private isLoading: boolean = false;
  private isShowDetailPanel: boolean = false;
  private activeRowId: string = '';
  private sortInfo: App.SortInfo = {
    sort: SortType.DESC,
    sortKey: 'updatedAt',
  };
  private pagination: App.Pagination = {
    total: 1,
    lastPage: 1,
    perPage: 10,
    currentPage: 1,
  };
  private requestParams: App.RequestParams = null;
  private requestDetailData: GrievanceReport.Report = null;
  private expandBlockId: string = '';

  get columns(): App.DataTableColumn[] {
    return [
      {
        label: this.$t('facility'),
        field: 'facility',
        sortable: false,
      },
      {
        label: this.$t('status'),
        field: 'status',
        sortable: false,
      },
      {
        label: this.$t('last_updated'),
        field: 'date',
        sortable: true,
        sortKey: 'updatedAt',
      },
      {
        label: this.$t('indicator_sub_indicator'),
        field: 'risk_profile',
      },
    ];
  }

  get responsesData(): GrievanceReport.Response[] {
    return get(this.requestDetailData, 'responses', []);
  }

  get isEmptyData(): boolean {
    return isEmpty(requestModule.requests);
  }

  created(): void {
    this.getIndicators();
    this.initData();
  }

  initData(): void {
    const { sort, sortKey } = this.sortInfo;
    this.requestParams = {
      page: this.pagination.currentPage,
      perPage: this.pagination.perPage,
      sortFields: `${sortKey}:${sort}`,
    };
    this.getRequestList(this.requestParams);
  }

  getIndicators(): void {
    requestModule.getIndicators({
      callback: {
        onFailure: (error: App.ResponseError) => {
          handleError(error);
        },
      },
    });
  }

  getRequestList(params?: GrievanceReport.RequestParams): Promise<void> {
    return new Promise((resolve) => {
      const requestParams = { ...this.requestParams, ...params };
      this.isLoading = true;
      requestModule.getRequestList({
        params: requestParams,
        callback: {
          onSuccess: () => {
            this.pagination = {
              total: requestModule.total,
              lastPage: requestModule.lastPage,
              currentPage: requestModule.currentPage,
              perPage: requestModule.perPage,
            };
            if (this.activeRowId) {
              this.requestDetailData = requestModule.requests.find(
                ({ id }) => id === this.activeRowId,
              );
            } else if (requestModule.requests.length > 0) {
              this.requestDetailData = requestModule.requests[0];
            }
            this.scrollToTop();
          },
          onFailure: (error: App.ResponseError) => {
            handleError(error);
          },
          onFinish: () => {
            this.isLoading = false;
            resolve();
          },
        },
      });
    });
  }

  getStatus(status: number): string {
    switch (status) {
      case ReportStatusEnum.NEW:
        return this.$t('new');
      case ReportStatusEnum.VIEWED:
        return this.$t('viewed');
      default:
        return this.$t('response_sent');
    }
  }

  scrollToTop(): void {
    this.$nextTick(() => {
      this.dashboardLayout.scrollToTop();
    });
  }

  openRequestDetailPanel(): void {
    this.isShowDetailPanel = true;
  }

  closeRequestDetailPanel(): void {
    this.activeRowId = '';
    this.requestDetailData = null;
    this.isShowDetailPanel = false;
  }

  clickRequestItem(request: GrievanceReport.Report) {
    this.activeRowId = request.id;
    this.requestDetailData = request;

    if (request?.status === PriorityEnum.EXTREME) {
      this.handleStatusRequest(request);
    }

    this.expandFirstBlock();
    this.openRequestDetailPanel();
  }

  handleStatusRequest(request: GrievanceReport.Report) {
    this.getGrievanceReportDetail(request.id);
    this.requestDetailData = { ...request, status: 2 };
    this.getRequestList().then(() => {
      this.expandFirstBlock();
    });
  }

  async getGrievanceReportDetail(id: string): Promise<void> {
    try {
      this.isLoading = true;
      await getGrievanceReportDetail(id);
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  expandFirstBlock(): void {
    const data =
      isArray(this.responsesData) && this.responsesData.length > 0
        ? head(this.responsesData)
        : this.requestDetailData;
    this.expandBlockId = get(data, 'id');
  }

  expandBlock(id: string): void {
    if (this.expandBlockId !== id) {
      this.expandBlockId = id;
    }
  }

  sortColumn(key: string, type: string): void {
    this.sortInfo = {
      sort: type,
      sortKey: key,
    };
    this.requestParams.sortFields = `${key}:${type}`;
    this.getRequestList(this.requestParams);
  }

  pageOnChange(page: number): void {
    this.requestParams.page = page;
    this.getRequestList(this.requestParams);
  }

  getFacilityName(request: GrievanceReport.Report): string {
    return get(request, 'facility.name');
  }

  getDate(report: GrievanceReport.Report): string {
    return formatDate(report.updatedAt);
  }

  openRiskScanModal(): void {
    this.$modal.show(
      CommunityRiskScanModal,
      {},
      {
        width: '776px',
        height: 'auto',
        clickToClose: false,
        scrollable: true,
        adaptive: true,
      },
    );
  }

  renderDetailContent(): JSX.Element {
    return (
      <RequestPanel
        isShowDetailPanel={this.isShowDetailPanel}
        requestInfo={this.requestDetailData}
        responsesData={this.responsesData}
        expandBlockId={this.expandBlockId}
        close={this.closeRequestDetailPanel}
        refreshRequest={this.getRequestList}
        expandBlock={this.expandBlock}
        expandFirstBlock={this.expandFirstBlock}
      />
    );
  }

  renderItem(request: GrievanceReport.Report): JSX.Element {
    return (
      <Styled.Tr
        isActive={request.id === this.activeRowId}
        onClick={() => this.clickRequestItem(request)}
      >
        <Styled.Td>{this.getFacilityName(request)}</Styled.Td>
        <Styled.Td>{this.getStatus(request.status)}</Styled.Td>
        <Styled.Td>{this.getDate(request)}</Styled.Td>
        <Styled.Td>
          <IndicatorAndSubIndicator
            laborRisks={request.laborRisks as GrievanceReport.LaborRisk[]}
          />
        </Styled.Td>
      </Styled.Tr>
    );
  }

  renderEmptyData(): JSX.Element {
    if (this.isLoading) {
      return <SpinLoading />;
    }
    if (this.isEmptyData) {
      return (
        <Styled.EmptyContainer>
          <Styled.EmptyImage />
          <Styled.EmptyText>
            {this.$t('no_incident_reports_to_display')}
          </Styled.EmptyText>
        </Styled.EmptyContainer>
      );
    }
  }

  renderTable(): JSX.Element {
    return (
      <DataTable
        variant="secondary"
        numberRowLoading={10}
        isLoading={this.isLoading}
        columns={this.columns}
        data={requestModule.requests}
        pagination={this.pagination}
        sortColumn={this.sortColumn}
        pageOnChange={this.pageOnChange}
        scopedSlots={{
          tableRow: ({ item }: { item: GrievanceReport.Report }) =>
            this.renderItem(item),
        }}
      />
    );
  }

  render(): JSX.Element {
    return (
      <dashboard-layout ref="dashboardLayout">
        <Styled.Wrapper>
          <Styled.Title>{this.$t('sidebar.incident_reports')}</Styled.Title>
          {auth.hasCommunityRiskScan && (
            <Styled.Action>
              <Button
                label={this.$t('create_incident_report')}
                click={this.openRiskScanModal}
              />
            </Styled.Action>
          )}
          {this.isEmptyData ? this.renderEmptyData() : this.renderTable()}
          {this.renderDetailContent()}
        </Styled.Wrapper>
      </dashboard-layout>
    );
  }
}
