import { Vue, Component } from 'vue-property-decorator';
import { get } from 'lodash';
import { RESOURCES } from 'config/constants';
import { getUserInfo } from 'api/user-setting';
import auth from 'store/modules/auth';
import Button from 'components/FormUI/Button';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import Account from 'components/Account';
import * as Styled from './styled';

const BrandOrderModal = () => import('modals/BrandOrderModal');
const ConfirmModal = () => import('modals/ConfirmModal');
const BrandEditProfileModal = () => import('modals/BrandEditProfileModal');
const BrandSupplierModal = () => import('modals/BrandSupplierModal');

@Component
export default class BrandProfileContainer extends Vue {
  private isLoading: boolean = false;
  private userInfo: Auth.User = null;
  private supplier: Auth.Facility = null;
  private order: BrandProduct.Order = null;
  private images: string[] = [
    RESOURCES.YOU_CAN_ADD_SUPPLIERS,
    RESOURCES.YOU_CAN_ADD_ORDERS,
    RESOURCES.YOU_CAN_TRACE,
  ];

  created(): void {
    this.getUserInfo();
  }

  async getUserInfo(): Promise<void> {
    try {
      this.isLoading = true;
      const userInfo = await getUserInfo();
      this.userInfo = userInfo;
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  async onTrace(id: string): Promise<void> {
    this.$router.push({
      name: 'BrandProductTrace',
      params: { id },
    });
  }

  resetData(): void {
    this.supplier = null;
    this.order = null;
  }

  onChangeOrder(order: BrandProduct.Order): void {
    this.order = order;
  }

  onChangeSupplier(supplier: Auth.Facility): void {
    this.supplier = supplier;
  }

  showBrandOrderModal(): void {
    this.$modal.show(
      BrandOrderModal,
      {
        isEditModal: false,
        supplier: this.supplier,
        order: this.order,
        onSuccess: this.showAddOrderSuccessModal,
        addSupplier: this.showBrandSupplierModal,
        changeOrder: this.onChangeOrder,
        changeSupplier: this.onChangeSupplier,
      },
      {
        width: '547px',
        height: 'auto',
        classes: 'overflow-visible',
        clickToClose: false,
        adaptive: true,
      },
    );
  }

  showAddOrderSuccessModal(orderId: string): void {
    this.$modal.show(
      ConfirmModal,
      {
        icon: 'view_list',
        iconSize: '44',
        message: this.$t('addOrderSuccessModal.notice'),
        confirmLabel: this.$t('addOrderSuccessModal.trace_it_now'),
        confirmButtonVariant: 'primary',
        cancelLabel: this.$t('addOrderSuccessModal.back_to_orders'),
        cancelButtonVariant: 'outlinePrimary',
        onConfirm: () => this.onTrace(orderId),
        onClose: () => this.$router.push({ name: 'BrandProductOrder' }),
      },
      { width: '424px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  showBrandSupplierModal(): void {
    this.$modal.show(
      BrandSupplierModal,
      {
        acceptAllTier: false,
        onSuccess: (supplier: Auth.Facility) => {
          this.supplier = supplier;
          this.showBrandOrderModal();
        },
        onClose: this.showBrandOrderModal,
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

  openEditProfileModal(): void {
    const { currentFacility } = this.userInfo;
    const profile: Auth.Facility = {
      name: currentFacility.name,
      businessRegisterNumber: currentFacility.businessRegisterNumber,
      logo: currentFacility.logo,
      countryId: currentFacility.countryId,
      provinceId: currentFacility.provinceId,
      districtId: currentFacility.districtId,
      address: currentFacility.address,
    };
    this.$modal.show(
      BrandEditProfileModal,
      {
        profile,
        onSuccess: this.getUserInfo,
      },
      { width: '722px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  goToUserManagement() {
    this.$router.push({ name: 'BrandUserManagement' });
  }

  renderInfo(label: string, value: string): JSX.Element {
    return (
      <Styled.Row>
        <Styled.Label>{label}</Styled.Label>
        <Styled.Info>{value}</Styled.Info>
      </Styled.Row>
    );
  }

  renderBusinessNumber(): JSX.Element {
    const businessNumber = get(
      this.userInfo,
      'currentFacility.businessRegisterNumber',
      '',
    );
    return (
      <Styled.BusinessNumber>
        <Styled.Label>{this.$t('business_number')}</Styled.Label>
        <Styled.Info>{businessNumber}</Styled.Info>
      </Styled.BusinessNumber>
    );
  }

  renderLogo(): JSX.Element {
    const logo = get(this.userInfo, 'currentFacility.logo', '');
    return <Styled.Logo src={logo} />;
  }

  renderUpdateProfile(): JSX.Element {
    return (
      <Styled.UpdateProfile>
        <Button
          width="100%"
          icon="edit"
          iconSize="20"
          size="small"
          variant="transparentSecondary"
          label={this.$t('edit_your_profile')}
          click={this.openEditProfileModal}
        />
        {auth.isAdminType && (
          <Button
            width="100%"
            icon="people"
            iconSize="20"
            size="small"
            variant="transparentSecondary"
            label={this.$t('sidebar.user_management')}
            click={this.goToUserManagement}
          />
        )}
      </Styled.UpdateProfile>
    );
  }

  renderHeader(): JSX.Element {
    return (
      <Styled.Header>
        {this.renderBusinessNumber()}
        {this.renderLogo()}
        {this.renderUpdateProfile()}
      </Styled.Header>
    );
  }

  renderHeadquarter(): JSX.Element {
    const { country, province, district, address } =
      this.userInfo.currentFacility;
    return (
      <Styled.Headquarter>
        <Styled.SubTitle>
          {this.$t('brandOnboardPage.headquarter')}
        </Styled.SubTitle>
        {this.renderInfo(this.$t('country'), get(country, 'country'))}
        {this.renderInfo(this.$t('province'), get(province, 'province'))}
        {this.renderInfo(this.$t('district'), get(district, 'district'))}
        {this.renderInfo(this.$t('street_address'), address)}
      </Styled.Headquarter>
    );
  }

  renderActions(): JSX.Element {
    return (
      <Styled.Actions>
        <Styled.ButtonGroup>
          <Styled.YouCanTitle>{this.$t('you_can')}</Styled.YouCanTitle>
          {auth.hasManagePartnerMenu && (
            <Styled.Action>
              <Button
                size="extraMedium"
                width="130px"
                label={this.$t('add_suppliers')}
                click={() => this.$router.push({ name: 'BrandSuppliers' })}
              />
            </Styled.Action>
          )}
          <Styled.Action>
            <Button
              size="extraMedium"
              width="130px"
              label={this.$t('add_orders')}
              click={() => {
                this.resetData();
                this.showBrandOrderModal();
              }}
            />
          </Styled.Action>
          {auth.hasTraceProduct && (
            <Styled.Action>
              <Button
                size="extraMedium"
                width="130px"
                label={this.$t('navbar.trace')}
                click={() => this.$router.push({ name: 'BrandProductOrder' })}
              />
            </Styled.Action>
          )}
        </Styled.ButtonGroup>
        <Styled.Figure>
          {this.images.map((image) => (
            <Styled.Image src={image} />
          ))}
        </Styled.Figure>
      </Styled.Actions>
    );
  }

  renderContent(): JSX.Element {
    const name = get(this.userInfo, 'currentFacility.name', '');
    return (
      <fragment>
        <Styled.Title>{name}</Styled.Title>
        {this.renderHeader()}
        <Styled.Content>
          {this.renderHeadquarter()}
          {this.renderActions()}
        </Styled.Content>
      </fragment>
    );
  }

  render(): JSX.Element {
    return (
      <dashboard-layout>
        <Styled.Wrapper>
          <Styled.Container>
            {this.isLoading && <SpinLoading isInline={false} />}
            {!this.isLoading && this.renderContent()}
            <Styled.Account>
              <Account />
            </Styled.Account>
          </Styled.Container>
        </Styled.Wrapper>
      </dashboard-layout>
    );
  }
}
