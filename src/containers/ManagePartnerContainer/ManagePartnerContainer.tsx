import { Vue, Component } from 'vue-property-decorator';
import { get, head } from 'lodash';
import partnerManagement from 'store/modules/partner-management';
import { deletePartner } from 'api/partner-management';
import { handleError } from 'components/Toast';
import DataTable from 'components/DataTable';
import Button from 'components/FormUI/Button';
import auth from 'store/modules/auth';
import * as Styled from './styled';

const PartnerManagementModal = () => import('modals/PartnerManagementModal');
const ConfirmModal = () => import('modals/ConfirmModal');

@Component
export default class ManagePartnerContainer extends Vue {
  private isLoading: boolean = false;
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
        label: this.$t('type'),
        width: '130px',
      },
      {
        label: this.$t('business_name'),
        width: '180px',
      },
      {
        label: this.$t('managePartnerPage.os_id'),
        width: '150px',
      },
      {
        label: this.$t('managePartnerPage.contact_name'),
        width: '150px',
      },
      {
        label: this.$t('managePartnerPage.phone'),
        width: '150px',
      },
      {
        label: this.$t('email'),
        width: '200px',
      },
      {
        label: '',
        width: '52px',
      },
    ];
  }

  created(): void {
    this.initData();
  }

  initData(): void {
    this.requestParams = {
      page: this.pagination.currentPage,
      perPage: this.pagination.perPage,
    };
    this.getListPartner(this.requestParams);
  }

  getListPartner(params?: PartnerManagement.RequestParams): void {
    const requestParams = { ...this.requestParams, ...params };
    this.isLoading = true;
    partnerManagement.getPartnerList({
      params: requestParams,
      callback: {
        onSuccess: () => {
          this.pagination = {
            total: partnerManagement.total,
            lastPage: partnerManagement.lastPage,
            currentPage: partnerManagement.currentPage,
            perPage: partnerManagement.perPage,
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

  reloadData(): void {
    this.requestParams = { page: 1, perPage: 10 };
    this.pagination.currentPage = 1;
    this.getListPartner(this.requestParams);
  }

  pageOnChange(page: number): void {
    this.requestParams.page = page;
    this.getListPartner(this.requestParams);
  }

  openAddPartnerModal(): void {
    this.$modal.show(
      PartnerManagementModal,
      {
        onSuccess: this.reloadData,
      },
      {
        width: '640px',
        height: 'auto',
        classes: 'overflow-visible',
        clickToClose: false,
        adaptive: true,
      },
    );
  }

  openDeletePartnerModal(partner: PartnerManagement.Partner): void {
    this.$modal.show(
      ConfirmModal,
      {
        icon: 'delete',
        iconSize: '44',
        message: this.$t('managePartnerPage.delete_partner_message'),
        note: this.$t('this_action_cannot_be_undone'),
        confirmLabel: this.$t('common.action.yes_delete'),
        confirmButtonVariant: 'danger',
        cancelLabel: this.$t('common.action.cancel'),
        onConfirm: () => this.deletePartner(partner.id),
      },
      { width: '410px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  async deletePartner(partnerId: string): Promise<void> {
    try {
      this.isLoading = true;
      await deletePartner(partnerId);
      this.reloadData();
      this.$toast.success(this.$t('onboardPage.successfully_removed_partner'));
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  headerAction(): JSX.Element {
    if (
      auth.showAddBroker ||
      auth.showAddProcessingFacility ||
      auth.hasLogTransport
    ) {
      return (
        <Button
          width="100%"
          label={this.$t('managePartnerPage.add_partner')}
          click={() => this.openAddPartnerModal()}
        />
      );
    }
  }

  renderRowItem(partner: PartnerManagement.Partner): JSX.Element {
    const user = head(partner.users);
    return (
      <Styled.Tr>
        <Styled.Td>{get(partner, 'type.name')}</Styled.Td>
        <Styled.Td>{partner.name}</Styled.Td>
        <Styled.Td>{partner.oarId}</Styled.Td>
        <Styled.Td>
          {get(user, 'firstName', '')} {get(user, 'lastName', '')}
        </Styled.Td>
        <Styled.Td>{get(user, 'phoneNumber', '')}</Styled.Td>
        <Styled.Td>{get(user, 'email', '')}</Styled.Td>
        <Styled.Td>
          <Styled.RowActions>
            <Button
              icon="remove"
              variant="transparentPrimary"
              size="small"
              iconSize="20"
              click={() => this.openDeletePartnerModal(partner)}
            />
          </Styled.RowActions>
        </Styled.Td>
      </Styled.Tr>
    );
  }

  render(): JSX.Element {
    return (
      <dashboard-layout>
        <Styled.Wrapper>
          <Styled.Title>
            {this.$t('managePartnerPage.manage_partners')}
          </Styled.Title>
          <Styled.Action>{this.headerAction()}</Styled.Action>
          <DataTable
            variant="secondary"
            numberRowLoading={10}
            isLoading={this.isLoading}
            columns={this.columns}
            data={partnerManagement.partners}
            pagination={this.pagination}
            pageOnChange={this.pageOnChange}
            scopedSlots={{
              tableRow: ({ item }: { item: PartnerManagement.Partner }) =>
                this.renderRowItem(item),
            }}
          >
            <Styled.EmptyData slot="emptyRow" />
          </DataTable>
        </Styled.Wrapper>
      </dashboard-layout>
    );
  }
}
