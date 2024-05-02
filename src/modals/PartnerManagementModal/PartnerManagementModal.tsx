import { Mixins, Component, Prop } from 'vue-property-decorator';
import { PartnerTypeEnum } from 'enums/onboard';
import LocationMixin from 'components/FormUI/Location/LocationMixin';
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

  created(): void {
    this.fetchDataLocation();
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

  render(): JSX.Element {
    return (
      <modal-layout
        title={this.$t('managePartnerPage.add_partner')}
        closeModal={this.closeModal}
      >
        <Styled.Container>
          <Partner
            title={this.$t('broker')}
            width="100%"
            add={() => this.openPartnerModal({ type: PartnerTypeEnum.BROKER })}
          />
          <Partner
            title={this.$t('processing_facility')}
            width="100%"
            add={() =>
              this.openPartnerModal({
                type: PartnerTypeEnum.PROCESSING_FACILITY,
              })
            }
          />
          <Partner
            title={this.$t('transporter')}
            width="100%"
            add={() =>
              this.openPartnerModal({ type: PartnerTypeEnum.TRANSPORTER })
            }
          />
        </Styled.Container>
      </modal-layout>
    );
  }
}
