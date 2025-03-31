import { Vue, Component, Prop } from 'vue-property-decorator';
import { getBusinessLocation } from 'utils/helpers';
import { getRiskLevel } from 'utils/risk-assessment';
import { deleteFacilityGroup } from 'api/facility-management';
import { handleError } from 'components/Toast';
import DataTable from 'components/DataTable';
import Button from 'components/FormUI/Button';
import RiskAssessment from 'components/SupplierMap/RiskAssessment';
import SupplierDetail from 'components/SupplierDetail';
import * as Styled from './styled';

const ConfirmModal = () => import('modals/ConfirmModal');
const FacilityGroupInformationModal = () =>
  import('modals/FacilityGroupInformationModal');

@Component
export default class TableView extends Vue {
  @Prop({ default: [] }) readonly facilities: Auth.Facility[];
  @Prop({ default: null }) readonly pagination: App.Pagination;
  @Prop({ default: false }) readonly isLoading: App.Pagination;
  @Prop({ required: true }) pageChange: (page: number) => void;
  @Prop({ required: true }) deleteSuccess: () => void;

  private currentSupplierId: string = null;

  get columns(): App.DataTableColumn[] {
    return [
      {
        label: this.$t('id'),
        field: 'farmId',
        sortable: false,
      },
      {
        label: this.$t('name'),
        field: 'name',
        sortable: false,
      },
      {
        label: this.$t('farm_group_risk', {
          name: this.$route.meta.params.name,
        }),
        field: 'farmGroupRisk',
        sortable: false,
      },
      {
        label: this.$t('location'),
        field: 'location',
        sortable: false,
      },
      {
        label: '',
        field: '',
        width: '250px',
      },
    ];
  }

  openDetailModal(facility: Auth.Facility): void {
    this.$modal.show(
      FacilityGroupInformationModal,
      {
        id: facility.id,
        setCurrentSupplierId: this.setCurrentSupplierId,
      },
      {
        name: 'FacilityGroupInformationModal',
        width: '677px',
        height: 'auto',
        clickToClose: false,
        adaptive: true,
        transition: 'none',
      },
    );
  }

  async onDeleteFacility(supplierId: string): Promise<void> {
    try {
      await deleteFacilityGroup(supplierId);
      this.$toast.success(this.$t('successfully_deleted'));
      this.deleteSuccess();
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  setCurrentSupplierId(id: string = null): void {
    if (id) {
      this.$modal.hide('FacilityGroupInformationModal');
    }
    this.currentSupplierId = id;
  }

  openDeleteFacilityModal(facility: Auth.Facility): void {
    this.$modal.show(
      ConfirmModal,
      {
        icon: 'delete_forever',
        iconSize: '76',
        message: this.$t('remove_farm_group'),
        note: this.$t('this_action_cannot_be_undone'),
        confirmLabel: this.$t('common.action.yes_delete'),
        confirmButtonVariant: 'danger',
        cancelLabel: this.$t('common.action.cancel'),
        onConfirm: () => this.onDeleteFacility(facility.id),
      },
      { width: '391px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  renderActions(facility: Auth.Facility): JSX.Element {
    return (
      <Styled.Action>
        <Button
          label={this.$t('common.action.view_farm_group')}
          icon="TreeView"
          iconSize="20"
          variant="transparentSecondary"
          size="small"
          underlineLabel
          click={() => this.openDetailModal(facility)}
        />
        <Button
          label={this.$t('common.action.remove')}
          icon="delete_forever"
          iconSize="20"
          variant="transparentSecondary"
          size="small"
          underlineLabel
          click={() => this.openDeleteFacilityModal(facility)}
        />
      </Styled.Action>
    );
  }

  renderRowItem(facility: Auth.Facility): JSX.Element {
    const riskLevel = getRiskLevel(facility);
    return (
      <Styled.Tr>
        <Styled.Td>{facility.farmId}</Styled.Td>
        <Styled.Td>{facility.name}</Styled.Td>
        <Styled.Td>
          <RiskAssessment status={riskLevel} isBar />
        </Styled.Td>
        <Styled.Td>{getBusinessLocation(facility)}</Styled.Td>
        <Styled.Td>{this.renderActions(facility)}</Styled.Td>
      </Styled.Tr>
    );
  }

  renderEmpty(): JSX.Element {
    return <Styled.EmptyData slot="emptyRow" />;
  }

  render(): JSX.Element {
    return (
      <fragment>
        <DataTable
          numberRowLoading={10}
          isLoading={this.isLoading}
          columns={this.columns}
          data={this.facilities}
          pageOnChange={this.pageChange}
          pagination={this.pagination}
          scopedSlots={{
            tableRow: ({ item }: { item: Auth.Facility }) =>
              this.renderRowItem(item),
          }}
        >
          {this.renderEmpty()}
        </DataTable>
        {this.currentSupplierId && (
          <SupplierDetail
            supplierId={this.currentSupplierId}
            close={() => {
              this.setCurrentSupplierId();
            }}
          />
        )}
      </fragment>
    );
  }
}
