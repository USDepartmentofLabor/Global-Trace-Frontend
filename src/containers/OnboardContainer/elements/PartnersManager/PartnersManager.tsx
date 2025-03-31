import { Vue, Component, Prop } from 'vue-property-decorator';
import { flatMap, isEmpty } from 'lodash';
import { PartnerTypeEnum } from 'enums/onboard';
import { UserRoleEnum } from 'enums/user';
import { handleError } from 'components/Toast';
import {
  deletePartner,
  getBusinessPartnerList,
  getInviteRoles,
} from 'api/onboard';
import { SpinLoading } from 'components/Loaders';
import auth from 'store/modules/auth';
import Button from 'components/FormUI/Button';
import PartnerList from './elements/PartnerList';
import * as Styled from './styled';

const PartnerModal = () => import('modals/PartnerModal');

@Component
export default class PartnersManager extends Vue {
  @Prop({
    default: () => {
      //
    },
  })
  updated: () => void;

  private isLoading: boolean = false;
  private isSubmitting: boolean = false;
  private partners: Onboard.PartnerOption[] = [];
  private inviteRoles: RoleAndPermission.Role[] = [];

  get brokers(): Onboard.PartnerOption[] {
    return this.partners.filter(({ type }) => type === PartnerTypeEnum.BROKER);
  }

  get processingFacilities(): Onboard.PartnerOption[] {
    return this.partners.filter(
      ({ type }) =>
        type !== PartnerTypeEnum.BROKER && type !== PartnerTypeEnum.TRANSPORTER,
    );
  }

  get transporters(): Onboard.PartnerOption[] {
    return this.partners.filter(
      ({ type }) => type === PartnerTypeEnum.TRANSPORTER,
    );
  }

  created(): void {
    this.initData();
  }

  async initData(): Promise<void> {
    this.isLoading = true;
    await Promise.all([this.fetchPartners(), this.requestInviteRoles()]);
    this.isLoading = false;
  }

  async requestInviteRoles() {
    try {
      this.inviteRoles = await getInviteRoles({});
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  getPartnerType(type: UserRoleEnum): PartnerTypeEnum {
    switch (type) {
      case UserRoleEnum.BROKER:
        return PartnerTypeEnum.BROKER;
      case UserRoleEnum.GINNER:
      case UserRoleEnum.SPINNER:
      case UserRoleEnum.MILL:
        return PartnerTypeEnum.PROCESSING_FACILITY;
      case UserRoleEnum.TRANSPORTER:
        return PartnerTypeEnum.TRANSPORTER;
    }
  }

  async fetchPartners(): Promise<void> {
    try {
      const facilities = await getBusinessPartnerList();
      this.partners = facilities.map(({ id, name, type }) => {
        return {
          id: id,
          name: name,
          type: this.getPartnerType(type.name),
          facilityType: type,
        };
      });
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  async removePartner(id: string): Promise<void> {
    try {
      await deletePartner(id);
      this.partners = this.partners.filter((partner) => partner.id !== id);
      this.$toast.success(this.$t('onboardPage.successfully_removed_partner'));
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  openPartnerModal(params: Onboard.PartnerModalProps): void {
    this.$modal.show(
      PartnerModal,
      {
        ...params,
        onSuccess: this.fetchPartners,
      },
      {
        width: '776px',
        height: 'auto',
        classes: 'overflow-visible',
        adaptive: true,
        clickToClose: false,
      },
    );
  }

  renderPartnerList(): JSX.Element {
    return (
      <Styled.Container
        showAddBroker={auth.showAddBroker}
        showAddProcessingFacility={auth.showAddProcessingFacility}
        showAddTransporter={auth.hasLogTransport}
      >
        {auth.showAddBroker && (
          <PartnerList
            partners={this.brokers}
            title={this.$t('broker')}
            add={() => this.openPartnerModal({ type: PartnerTypeEnum.BROKER })}
            remove={this.removePartner}
          />
        )}
        {auth.showAddProcessingFacility && !isEmpty(this.inviteRoles) && (
          <PartnerList
            partners={this.processingFacilities}
            title={flatMap(this.inviteRoles, 'name').join(' / ')}
            add={() =>
              this.openPartnerModal({
                title: this.$t('add_item', {
                  item: flatMap(this.inviteRoles, 'name').join(' / '),
                }),
                type: PartnerTypeEnum.PROCESSING_FACILITY,
              })
            }
            remove={this.removePartner}
          />
        )}
        {auth.hasLogTransport && (
          <PartnerList
            partners={this.transporters}
            title={this.$t('transporter')}
            add={() =>
              this.openPartnerModal({ type: PartnerTypeEnum.TRANSPORTER })
            }
            remove={this.removePartner}
          />
        )}
      </Styled.Container>
    );
  }

  render(): JSX.Element {
    return (
      <fragment>
        {this.isLoading ? <SpinLoading /> : this.renderPartnerList()}
        <Styled.Action>
          <Button
            width="100%"
            type="button"
            variant="primary"
            label={this.$t('next')}
            isLoading={this.isLoading || this.isSubmitting}
            disable={this.isLoading || this.isSubmitting}
            click={this.updated}
          />
        </Styled.Action>
      </fragment>
    );
  }
}
