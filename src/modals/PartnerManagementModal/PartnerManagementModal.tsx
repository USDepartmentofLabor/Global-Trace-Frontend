import { Mixins, Component, Prop } from 'vue-property-decorator';
import { flatMap, isEmpty } from 'lodash';
import { PartnerTypeEnum } from 'enums/onboard';
import LocationMixin from 'components/FormUI/Location/LocationMixin';
import { getInviteRoles } from 'api/onboard';
import { SpinLoading } from 'components/Loaders';
import { handleError } from 'components/Toast';
import auth from 'store/modules/auth';
import Partner from './elements/Partner';
import * as Styled from './styled';

const PartnerModal = () => import('modals/PartnerModal');

@Component
export default class PartnerManagementModal extends Mixins(LocationMixin) {
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  onSuccess: () => void;

  private inviteRoles: RoleAndPermission.Role[] = [];
  private isLoading: boolean = true;

  created(): void {
    this.fetchDataLocation();
    this.requestInviteRoles();
  }

  async requestInviteRoles() {
    try {
      this.inviteRoles = await getInviteRoles({});
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  closeModal(): void {
    this.$emit('close');
  }

  onAddPartnerSuccess(): void {
    this.onSuccess();
    this.closeModal();
  }

  openPartnerModal(params: Onboard.PartnerModalProps): void {
    this.$modal.show(
      PartnerModal,
      {
        ...params,
        onSuccess: this.onAddPartnerSuccess,
      },
      {
        width: '776px',
        height: 'auto',
        classes: 'overflow-visible',
        clickToClose: false,
        adaptive: true,
      },
    );
  }

  renderContent(): JSX.Element {
    if (this.isLoading) {
      return <SpinLoading />;
    }
    return (
      <perfect-scrollbar>
        {auth.showAddBroker && (
          <Partner
            title={this.$t('broker')}
            add={() => this.openPartnerModal({ type: PartnerTypeEnum.BROKER })}
          />
        )}
        {auth.showAddProcessingFacility && !isEmpty(this.inviteRoles) && (
          <Partner
            title={flatMap(this.inviteRoles, 'name').join(' / ')}
            add={() =>
              this.openPartnerModal({
                title: this.$t('add_item', {
                  item: flatMap(this.inviteRoles, 'name').join(' / '),
                }),
                type: PartnerTypeEnum.PROCESSING_FACILITY,
              })
            }
          />
        )}
        {auth.hasLogTransport && (
          <Partner
            title={this.$t('transporter')}
            add={() =>
              this.openPartnerModal({ type: PartnerTypeEnum.TRANSPORTER })
            }
          />
        )}
      </perfect-scrollbar>
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout
        title={this.$t('managePartnerPage.add_partner')}
        closeModal={this.closeModal}
      >
        <Styled.Container>{this.renderContent()}</Styled.Container>
      </modal-layout>
    );
  }
}
