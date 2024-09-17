import { Vue, Component, Prop } from 'vue-property-decorator';
import { get, head, isNull } from 'lodash';
import auth from 'store/modules/auth';
import { formatDate } from 'utils/date';
import { DATE_TIME_FORMAT } from 'config/constants';
import { deleteSupplier } from 'api/brand-supplier';
import DataTable from 'components/DataTable';
import Button from 'components/FormUI/Button';
import { handleError } from 'components/Toast';
import RiskAssessment from 'components/SupplierMap/RiskAssessment';
import * as Styled from './styled';

const ConfirmModal = () => import('modals/ConfirmModal');
const BrandSupplierModal = () => import('modals/BrandSupplierModal');

@Component
export default class TableView extends Vue {
  @Prop({ default: [] }) readonly suppliers: Auth.Facility[];
  @Prop({ default: null }) readonly pagination: App.Pagination;
  @Prop({ default: false }) readonly isLoading: App.Pagination;
  @Prop({ required: true }) pageChange: (page: number) => void;
  @Prop({ required: true }) sortColumn: (key: string, type: string) => void;
  @Prop({ required: true }) editSuccess: () => void;
  @Prop({ required: true }) deleteSuccess: () => void;
  @Prop({
    default: () => {
      //
    },
  })
  changeCurrentSupplierId: (id: string) => void;

  get columns(): App.DataTableColumn[] {
    return [
      {
        label: this.$t('business_name'),
        field: 'name',
        sortable: true,
        sortKey: 'name',
      },
      {
        label: this.$t('risk_assessment'),
        field: 'riskAssessment',
        sortable: true,
        sortKey: 'overallRiskLevel',
      },
      {
        label: this.$t('brandSupplierPage.register_number'),
        field: 'businessRegisterNumber',
        sortable: false,
      },
      {
        label: this.$t('brandSupplierPage.os_id'),
        field: 'oarId',
        sortable: false,
      },
      {
        label: this.$t('type'),
        field: 'type',
        sortable: false,
      },
      {
        label: this.$t('last_activity'),
        field: 'updatedAt',
        sortable: true,
        sortKey: 'users.lastLoginAt',
        width: '170px',
      },

      {
        label: '',
        field: '',
      },
    ];
  }

  getFacilityType(type: string): string {
    return type;
  }

  getLastLoginAt(users: Auth.User[]): string {
    const lastLoginAt = get(head(users), 'lastLoginAt', null);
    if (isNull(lastLoginAt)) {
      return '-';
    }
    return formatDate(lastLoginAt, DATE_TIME_FORMAT);
  }

  openDetailModal(id: string): void {
    if (auth.hasViewSupplierDetail) {
      this.changeCurrentSupplierId(id);
    }
  }

  async onDeleteSupplier(supplierId: string): Promise<void> {
    try {
      await deleteSupplier(supplierId);
      this.$toast.success(this.$t('successfully_deleted'));
      this.deleteSuccess();
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  openDeleteSupplierModal(supplier: Auth.Facility): void {
    this.$modal.show(
      ConfirmModal,
      {
        icon: 'delete_forever',
        iconSize: '76',
        message: this.$t('delete_supplier_message'),
        note: this.$t('this_action_cannot_be_undone'),
        confirmLabel: this.$t('common.action.yes_delete'),
        confirmButtonVariant: 'danger',
        cancelLabel: this.$t('common.action.cancel'),
        onConfirm: () => this.onDeleteSupplier(supplier.id),
      },
      { width: '371px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  openEditSupplierModal(supplier: Auth.Facility): void {
    this.$modal.show(
      BrandSupplierModal,
      {
        onSuccess: this.editSuccess,
        supplier,
      },
      {
        width: '598px',
        height: 'auto',
        classes: 'overflow-visible',
        clickToClose: false,
        adaptive: true,
      },
    );
  }

  renderActions(supplier: Auth.Facility): JSX.Element {
    return (
      <Styled.Action>
        <Button
          label={this.$t('edit')}
          icon="edit"
          iconSize="20"
          variant="transparentPrimary"
          size="small"
          underlineLabel
          vOn:click_native={(event: Event) => {
            event.stopPropagation();
            this.openEditSupplierModal(supplier);
          }}
        />
        <Button
          label={this.$t('common.action.remove')}
          icon="delete_forever"
          iconSize="20"
          variant="transparentPrimary"
          size="small"
          underlineLabel
          vOn:click_native={(event: Event) => {
            event.stopPropagation();
            this.openDeleteSupplierModal(supplier);
          }}
        />
      </Styled.Action>
    );
  }

  renderRowItem(supplier: Auth.Facility): JSX.Element {
    return (
      <Styled.Tr
        vOn:click={() => {
          this.openDetailModal(supplier.id);
        }}
      >
        <Styled.Td>{supplier.name}</Styled.Td>
        <Styled.Td>
          <RiskAssessment supplier={supplier} isBar />
        </Styled.Td>
        <Styled.Td>{supplier.businessRegisterNumber}</Styled.Td>
        <Styled.Td>{supplier.oarId}</Styled.Td>
        <Styled.Td>
          {this.getFacilityType(get(supplier, 'type.name'))}
        </Styled.Td>
        <Styled.Td>{this.getLastLoginAt(supplier.users)}</Styled.Td>

        <Styled.Td>{this.renderActions(supplier)}</Styled.Td>
      </Styled.Tr>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.TableContainer>
        <DataTable
          numberRowLoading={10}
          isLoading={this.isLoading}
          columns={this.columns}
          data={this.suppliers}
          pageOnChange={this.pageChange}
          pagination={this.pagination}
          sortColumn={this.sortColumn}
          scopedSlots={{
            tableRow: ({ item }: { item: Auth.Facility }) =>
              this.renderRowItem(item),
          }}
        />
      </Styled.TableContainer>
    );
  }
}
