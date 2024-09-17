import { Vue, Component } from 'vue-property-decorator';
import { get, isEmpty, isNull } from 'lodash';
import grievanceReportModule from 'store/modules/grievance-report';
import { getRoleName } from 'utils/user';
import auth from 'store/modules/auth';
import Button from 'components/FormUI/Button';
import DataTable from 'components/DataTable';
import { SpinLoading } from 'components/Loaders';
import { handleError } from 'components/Toast';
import { formatDate } from 'utils/date';
import { SortType } from 'enums/app';
import * as Styled from './styled';

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
        label: this.$t('source'),
        field: 'source',
        width: '200px',
      },
      {
        label: this.$t('grievanceReportPage.facility'),
        field: 'facility',
        sortable: true,
        sortKey: 'facility.name',
        width: '463px',
      },
      {
        label: this.$t('grievanceReportPage.date'),
        field: 'date',
        sortable: true,
        sortKey: 'recordedAt',
        width: '132px',
      },
      {
        label: this.$t('grievanceReportPage.assign'),
        field: 'assign',
        width: '340px',
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
        onSuccess: () => {
          this.reloadData(false);
        },
      },
      {
        width: '776px',
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
        title: this.$t('grievanceReportPage.title'),
      },
      {
        width: '543px',
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

  facilityName(report: GrievanceReport.Report): string {
    return get(report, 'facility.name');
  }

  getDate(report: GrievanceReport.Report): string {
    return formatDate(report.recordedAt);
  }

  getAssign(report: GrievanceReport.Report): string {
    if (get(report, 'assignee.email')) {
      return report.assignee.email;
    } else if (report.isNoFollowUp) {
      return this.$t('createReportModal.no_follow_up');
    }
    return '';
  }

  renderActionEdit(reportId: string): JSX.Element {
    return (
      <Button
        underlineLabel={true}
        label={this.$t('edit')}
        icon="edit"
        variant="transparentSecondary"
        size="small"
        iconSize="20"
        click={() => this.openEditGrievanceModal(reportId)}
      />
    );
  }

  renderActionView(reportId: string): JSX.Element {
    return (
      <Button
        underlineLabel={true}
        label={this.$t('common.action.view')}
        icon="eye"
        variant="transparentSecondary"
        size="small"
        iconSize="20"
        click={() => this.openViewGrievanceModal(reportId)}
      />
    );
  }

  renderItem(report: GrievanceReport.Report): JSX.Element {
    const canEdit =
      isNull(report.assignee) && !report.isNoFollowUp && auth.hasReferReport;
    return (
      <Styled.Tr isHighlight={canEdit}>
        <Styled.Td>{getRoleName(report.creator)}</Styled.Td>
        <Styled.Td>{this.facilityName(report)}</Styled.Td>
        <Styled.Td>{this.getDate(report)}</Styled.Td>
        <Styled.Td>
          <Styled.Email>{this.getAssign(report)}</Styled.Email>
        </Styled.Td>
        <Styled.Td>
          <Styled.Actions>
            {canEdit && this.renderActionEdit(report.id)}
            {!canEdit && this.renderActionView(report.id)}
          </Styled.Actions>
        </Styled.Td>
      </Styled.Tr>
    );
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

  renderHeaderAction(): JSX.Element {
    if (auth.hasReportListMenu) {
      return (
        <Styled.HeaderAction slot="headerAction">
          <Button
            width="209px"
            label={this.$t('grievanceReportPage.create_new_reports')}
            icon="plus"
            click={this.openAddGrievanceModal}
          />
        </Styled.HeaderAction>
      );
    }
    return null;
  }

  renderTable(): JSX.Element {
    return (
      <DataTable
        numberRowLoading={10}
        isLoading={this.isLoading}
        columns={this.columns}
        data={grievanceReportModule.reports}
        pagination={this.pagination}
        sortColumn={this.sortColumn}
        pageOnChange={this.pageOnChange}
        scopedSlots={{
          tableRow: ({ item }: { item: GrievanceReport.Report }) =>
            this.renderItem(item),
        }}
      >
        <Styled.EmptyData slot="emptyRow" />
      </DataTable>
    );
  }

  render(): JSX.Element {
    return (
      <dashboard-layout>
        {this.renderHeaderAction()}
        <Styled.Wrapper>
          {this.isEmptyData ? this.renderEmptyData() : this.renderTable()}
        </Styled.Wrapper>
      </dashboard-layout>
    );
  }
}
