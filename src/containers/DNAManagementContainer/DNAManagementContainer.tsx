import { Vue, Component } from 'vue-property-decorator';
import { isEmpty } from 'lodash';
import { PAGINATION_DEFAULT } from 'config/constants';
import auth from 'store/modules/auth';
import { formatDate } from 'utils/date';
import { AddDNAOptionEnum, DNAStatusEnum } from 'enums/dna';
import { SpinLoading } from 'components/Loaders';
import { deleteDNA, getDNAList } from 'api/dna-management';
import Button from 'components/FormUI/Button';
import DataTable from 'components/DataTable';
import { handleError } from 'components/Toast';
import DropdownMenu from 'components/DropdownMenu';
import * as Styled from './styled';

const DNATestModal = () => import('modals/DNATestModal');
const ConfirmModal = () => import('modals/ConfirmModal');

@Component
export default class DNAManagementContainer extends Vue {
  private isLoading: boolean = false;
  private isLoadingDownload: boolean = false;
  private sortInfoDefault: App.SortInfo = {
    sortKey: 'createdAt',
    sort: 'DESC',
  };
  private sortInfo: App.SortInfo = this.sortInfoDefault;
  private pagination: App.Pagination = PAGINATION_DEFAULT;
  private DNAList: DNAManagement.DNA[] = [];
  private requestParams: App.RequestParams = null;
  private actionOptions: App.DropdownMenuOption[] = [
    {
      id: AddDNAOptionEnum.ISOTOPIC,
      name: this.$t('isotopic_DNA_test'),
    },
    {
      id: AddDNAOptionEnum.SYNTHETIC,
      name: this.$t('synthetic_DNA_marking'),
    },
  ];

  get columns(): App.DataTableColumn[] {
    return [
      {
        label: this.$t('test_date'),
        field: 'testedAt',
        sortable: true,
        sortKey: 'testedAt',
      },
      {
        label: this.$t('product_supplier'),
        field: 'productSupplierId',
        sortable: true,
        sortKey: 'productSupplier.name',
      },
      {
        label: this.$t('product_id'),
        field: 'productId',
      },
      {
        label: this.$t('results'),
        field: 'status',
        sortable: true,
        sortKey: 'status',
      },
      {
        label: this.$t('attachment'),
        field: 'uploadProofs',
      },
      {
        label: '',
        field: '',
        width: '70px',
      },
    ];
  }

  get isEmptyData(): boolean {
    return isEmpty(this.DNAList);
  }

  created(): void {
    if (auth.hasDNA) {
      this.initData();
    }
  }

  initData(): void {
    const { sort, sortKey } = this.sortInfo;
    this.requestParams = {
      page: this.pagination.currentPage,
      perPage: this.pagination.perPage,
      sortFields: `${sortKey}:${sort}`,
    };
    this.getDNAList(true);
  }

  async getDNAList(isFirstLoad: boolean = false): Promise<void> {
    try {
      this.isLoading = isFirstLoad;
      const response = await getDNAList(this.requestParams);
      this.DNAList = response.items;
      this.pagination = {
        total: response.total,
        lastPage: response.lastPage,
        currentPage: response.currentPage,
        perPage: response.perPage,
      };
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  sortColumn(key: string, type: string): void {
    this.sortInfo = {
      sort: type,
      sortKey: key,
    };
    this.requestParams.sortFields = `${key}:${type}`;
    this.getDNAList();
  }

  pageOnChange(page: number): void {
    this.requestParams.page = page;
    this.getDNAList();
  }

  setPage(page: number): void {
    this.requestParams.page = page;
  }

  resetTableOptions(): void {
    this.sortInfo = this.sortInfoDefault;
    this.pagination = PAGINATION_DEFAULT;
  }

  openAddDNAModal(type: AddDNAOptionEnum): void {
    this.$modal.show(
      DNATestModal,
      {
        type,
        onSuccess: () => {
          this.resetTableOptions();
          this.initData();
        },
      },
      { width: '640px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  async deleteDNA(DNAId: string): Promise<void> {
    try {
      await deleteDNA(DNAId);
      this.initData();
      this.$toast.success(this.$t('removed_dna'));
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  openDeleteQRCodeModal(DNAId: string): void {
    this.$modal.show(
      ConfirmModal,
      {
        icon: 'delete',
        iconSize: '44',
        message: this.$t('confirm_delete_dna'),
        note: this.$t('this_action_cannot_be_undone'),
        confirmLabel: this.$t('common.action.yes_delete'),
        confirmButtonVariant: 'danger',
        cancelLabel: this.$t('common.action.cancel'),
        onConfirm: () => this.deleteDNA(DNAId),
      },
      { width: '421px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  getStatusLabel(status: number): string {
    if (status === DNAStatusEnum.FAILED) {
      return this.$t('failed');
    }
    return this.$t('passed');
  }

  selectAction(option: App.DropdownMenuOption): void {
    this.openAddDNAModal(option.id as AddDNAOptionEnum);
  }

  renderEmptyRow(): JSX.Element {
    return <Styled.EmptyRow slot="emptyRow" />;
  }

  downloadProof(url: string): void {
    window.open(url, '_blank');
  }

  renderRowItem(DNA: DNAManagement.DNA): JSX.Element {
    const status = DNA.status === DNAStatusEnum.FAILED ? 'failed' : 'passed';
    return (
      <Styled.Tr>
        <Styled.Td>{formatDate(DNA.testedAt)}</Styled.Td>
        <Styled.Td>{DNA.productSupplier.name}</Styled.Td>
        <Styled.Td>{DNA.productId}</Styled.Td>
        <Styled.Td>
          <Styled.Status status={status}>{this.$t(status)}</Styled.Status>
        </Styled.Td>
        <Styled.Td>
          <Styled.ProofLinkList>
            {DNA.uploadProofs.map(({ fileName, link }) => (
              <Styled.ProofLink
                vOn:click={() => {
                  this.downloadProof(link);
                }}
              >
                {fileName}
              </Styled.ProofLink>
            ))}
          </Styled.ProofLinkList>
        </Styled.Td>
        {auth.hasLogDNA && (
          <Styled.Td>
            <Button
              label={this.$t('common.action.remove')}
              icon="delete"
              variant="transparentSecondary"
              size="small"
              iconSize="20"
              click={() => {
                this.openDeleteQRCodeModal(DNA.id);
              }}
            />
          </Styled.Td>
        )}
      </Styled.Tr>
    );
  }

  renderTable(): JSX.Element {
    return (
      <DataTable
        numberRowLoading={5}
        isLoading={this.isLoading}
        columns={this.columns}
        data={this.DNAList}
        pagination={this.pagination}
        sortColumn={this.sortColumn}
        pageOnChange={this.pageOnChange}
        scopedSlots={{
          tableRow: ({ item }: { item: DNAManagement.DNA }) =>
            this.renderRowItem(item),
        }}
      >
        {this.renderEmptyRow()}
      </DataTable>
    );
  }

  renderActionOption(option: App.DropdownMenuOption): JSX.Element {
    return <Styled.Label>{option.name}</Styled.Label>;
  }

  renderEmptyData(): JSX.Element {
    if (this.isLoading) {
      return <SpinLoading />;
    }
    return (
      <Styled.EmptyContainer>
        <Styled.EmptyText>{this.$t('dna_empty_description')}</Styled.EmptyText>
        <Styled.DNAEmptyImage />
      </Styled.EmptyContainer>
    );
  }

  render(): JSX.Element {
    return (
      <dashboard-layout>
        {auth.hasLogDNA && (
          <Styled.HeaderAction slot="headerAction">
            <DropdownMenu
              options={this.actionOptions}
              selectOption={this.selectAction}
              scopedSlots={{
                menuOption: ({ option }: { option: App.DropdownMenuOption }) =>
                  this.renderActionOption(option),
              }}
            >
              <Button label={this.$t('add_new_test')} icon="plus" />
            </DropdownMenu>
          </Styled.HeaderAction>
        )}
        <Styled.Wrapper>
          {this.isEmptyData ? this.renderEmptyData() : this.renderTable()}
        </Styled.Wrapper>
        {this.isLoadingDownload && <SpinLoading isInline={false} />}
      </dashboard-layout>
    );
  }
}
