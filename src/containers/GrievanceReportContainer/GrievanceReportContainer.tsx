import { Vue, Component } from 'vue-property-decorator';
import { isEmpty } from 'lodash';
import grievanceReportModule from 'store/modules/grievance-report';
import auth from 'store/modules/auth';
import Button from 'components/FormUI/Button';
import DataTable from 'components/DataTable';
import { SpinLoading } from 'components/Loaders';
import { handleError } from 'components/Toast';
import { SortType } from 'enums/app';
import * as Styled from './styled';
import Report from './elements/Report';

const CreateReportModal = () => import('modals/CreateReportModal');
const GrievanceReportModal = () => import('modals/GrievanceReportModal');

@Component
export default class GrievanceReportContainer extends Vue {
  private isLoading: boolean = false;
  private sortInfo: App.SortInfo = {
    sort: SortType.DESC,
    sortKey: 'createdAt',
  };
  private pagination: App.Pagination = {
    total: 1,
    lastPage: 1,
    perPage: 10,
    currentPage: 1,
  };
  private requestParams: App.RequestParams = null;

  get columns(): App.DataTableColumn[] {
    return [
      {
        label: this.$t('last_updated'),
        field: 'date',
        sortable: true,
        sortKey: 'latestActivityAt',
        width: '132px',
      },
      {
        label: this.$t('source'),
        field: 'source',
        width: '200px',
      },
      {
        label: this.$t('grievanceReportPage.facility'),
        field: 'facility',
        sortable: true,
        sortKey: 'facility.name',
        width: '248px',
      },
      {
        label: this.$t('follow_up_actions'),
        field: 'assignee',
        width: '320px',
      },
      {
        label: this.$t('overall_risk'),
        field: 'riskScore',
        width: '200px',
      },
      {
        label: '',
        field: '',
        width: '102px',
      },
    ];
  }

  get isEmptyData(): boolean {
    return isEmpty(grievanceReportModule.reports);
  }

  created(): void {
    this.fetchDataReport();
    this.initData();
  }

  initData(): void {
    const { sort, sortKey } = this.sortInfo;
    this.requestParams = {
      page: this.pagination.currentPage,
      perPage: this.pagination.perPage,
      sortFields: `${sortKey}:${sort}`,
    };
    this.getGrievanceReportList(this.requestParams);
  }

  fetchDataReport(): void {
    grievanceReportModule.getIndicators();
    grievanceReportModule.getReasons();
    grievanceReportModule.getAssignees();
  }

  reloadData(resetPagination: boolean = true): void {
    if (resetPagination) {
      this.requestParams = { page: 1, perPage: 10 };
      this.pagination.currentPage = 1;
    }
    this.getGrievanceReportList(this.requestParams);
    grievanceReportModule.getAssignees();
  }

  getGrievanceReportList(params?: GrievanceReport.RequestParams): void {
    const requestParams = { ...this.requestParams, ...params };
    this.isLoading = true;
    grievanceReportModule.getGrievanceReportList({
      params: requestParams,
      callback: {
        onSuccess: () => {
          this.pagination = {
            total: grievanceReportModule.total,
            lastPage: grievanceReportModule.lastPage,
            currentPage: grievanceReportModule.currentPage,
            perPage: grievanceReportModule.perPage,
          };
        },
        onFailure: (error: App.ResponseError) => {
          handleError(error);
        },
        onFinish: () => {
          this.isLoading = false;
        },
      },
    });
  }

  openAddGrievanceModal(): void {
    this.$modal.show(
      CreateReportModal,
      {
        onSuccess: this.reloadData,
      },
      {
        width: '776px',
        height: 'auto',
        scrollable: true,
        adaptive: true,
      },
    );
  }

  openEditGrievanceModal(reportId: string): void {
    this.$modal.show(
      GrievanceReportModal,
      {
        reportId,
        title: this.$t('grievanceReportPage.edit_report'),
        onSuccess: () => this.reloadData(false),
      },
      {
        width: '1080px',
        height: 'auto',
        scrollable: true,
        adaptive: true,
      },
    );
  }

  openViewGrievanceModal(reportId: string): void {
    this.$modal.show(
      GrievanceReportModal,
      {
        reportId,
        isEdit: false,
        viewOnly: true,
        title: this.$t('grievanceReportPage.title'),
      },
      {
        width: '1080px',
        height: 'auto',
        classes: 'overflow-visible',
        adaptive: true,
      },
    );
  }

  sortColumn(key: string, type: string): void {
    this.sortInfo = {
      sort: type,
      sortKey: key,
    };
    this.requestParams.sortFields = `${key}:${type}`;
    this.getGrievanceReportList(this.requestParams);
  }

  pageOnChange(page: number): void {
    this.requestParams.page = page;
    this.getGrievanceReportList(this.requestParams);
  }

  renderEmptyData(): JSX.Element {
    if (this.isLoading) {
      return <SpinLoading />;
    }
    return (
      <Styled.EmptyContainer>
        <Styled.EmptyText>
          {this.$t('grievanceReportPage.empty_message')}
        </Styled.EmptyText>
        <Styled.GrievanceEmptyImage />
      </Styled.EmptyContainer>
    );
  }

  renderHeader(): JSX.Element {
    return (
      <Styled.Header>
        <Styled.Title>{this.$t('sidebar.incident_reports')}</Styled.Title>
        {auth.hasReportListMenu && (
          <Button
            label={this.$t('create_incident_report')}
            click={this.openAddGrievanceModal}
          />
        )}
      </Styled.Header>
    );
  }

  renderTable(): JSX.Element {
    return (
      <Styled.Table>
        {this.renderHeader()}
        <DataTable
          numberRowLoading={10}
          isLoading={this.isLoading}
          columns={this.columns}
          data={grievanceReportModule.reports}
          pagination={this.pagination}
          sortColumn={this.sortColumn}
          pageOnChange={this.pageOnChange}
          scopedSlots={{
            tableRow: ({ item }: { item: GrievanceReport.Report }) => (
              <Report
                report={item}
                openEditGrievanceModal={this.openEditGrievanceModal}
                openViewGrievanceModal={this.openViewGrievanceModal}
              />
            ),
          }}
        >
          <Styled.EmptyData slot="emptyRow" />
        </DataTable>
      </Styled.Table>
    );
  }

  render(): JSX.Element {
    return (
      <dashboard-layout>
        <Styled.Wrapper>
          {this.isEmptyData ? this.renderEmptyData() : this.renderTable()}
        </Styled.Wrapper>
      </dashboard-layout>
    );
  }
}
