/* eslint-disable max-lines */
import { Vue, Component, Ref } from 'vue-property-decorator';
import { flatMap, get, isEmpty } from 'lodash';
import auth from 'store/modules/auth';
import { MAP_VIEW, TRACE_MAP_VIEW } from 'config/constants';
import { SupplierStatusEnum, UserRoleEnum } from 'enums/user';
import { deleteOrder } from 'api/brand-orders';
import { getSupplyChainTiers } from 'api/supply-chain';
import { getOrderDetail, getTrace, getTraceSuppliers } from 'api/brand-trace';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import SupplierDetail from 'components/SupplierDetail';
import Button from 'components/FormUI/Button';
import TraceOrderMap from 'components/SupplierMap/TraceOrderMap';
import DashboardLayout from 'components/Layout/DashboardLayout';
import * as Styled from './styled';
import TracingResult from './elements/TracingResult';
import Information from './elements/Information';

const OrderSupplierModal = () => import('modals/OrderSupplierModal');
const ConfirmModal = () => import('modals/ConfirmModal');
const BrandOrderModal = () => import('modals/BrandOrderModal');
const BrandSupplierModal = () => import('modals/BrandSupplierModal');

@Component
export default class BrandProductTraceContainer extends Vue {
  @Ref('dashboardLayout')
  readonly dashboardLayout!: DashboardLayout;
  @Ref('tracingResult')
  readonly tracingResult!: DashboardLayout;

  private supplierGroups: BrandSupplier.TraceSupplierMapGroup[] = [];
  private isTracing: boolean = true;
  private traceId: string = this.$route.params.id;
  private isLoading: boolean = true;
  private isShowDetail: boolean = true;
  private orderDetail: BrandTrace.OrderDetail = null;
  private canEditSupplierIds: string[] = [];
  private currentSupplierId: string = '';
  private tiers: Array<SupplyChain.SupplyChainTier[]> = [];

  get orderId(): string {
    return get(this.$route, 'params.id');
  }

  get supplierStatus(): SupplierStatusEnum {
    if (this.isTracing) {
      return SupplierStatusEnum.DRAFT;
    }
    return SupplierStatusEnum.READY;
  }

  get disabledTrace(): boolean {
    return !this.isTracing;
  }

  get mapViewOptions(): App.MapViewConstant {
    return this.isTracing ? TRACE_MAP_VIEW : MAP_VIEW;
  }

  get headerActionTitle(): string {
    return this.isShowDetail
      ? this.$t('brandOrderPage.hide_order_detail')
      : this.$t('brandOrderPage.show_order_detail');
  }

  get orderTitle(): string {
    return this.$t('brandOrderPage.order_title', {
      description: this.orderDetail.productDescription,
      quantity: this.orderDetail.quantity,
    });
  }

  created(): void {
    this.initData();
  }

  async initData(): Promise<void> {
    this.isLoading = true;
    await Promise.all([
      this.getTrace(),
      this.getOrderDetail(),
      this.getSupplyChainTiers(),
    ]);
    this.isLoading = false;
  }

  async getTrace(): Promise<void> {
    try {
      if (this.isTracing) {
        const supplierGroups = await getTraceSuppliers(this.traceId);
        this.canEditSupplierIds = flatMap(supplierGroups, 'orderSupplierId');
        this.supplierGroups = supplierGroups;
      } else {
        const { name, logo, mappingSuppliers } = await getTrace(this.traceId);
        this.supplierGroups = mappingSuppliers;
        this.addRootSupplier(name, logo);
        this.scrollToTracingResult();
      }
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  addRootSupplier(name: string, logo: string) {
    if (auth.isBrand && !isEmpty(this.supplierGroups)) {
      const rootIndex = this.supplierGroups.findIndex(({ isRoot }) => isRoot);
      this.supplierGroups[rootIndex].isRoot = false;
      this.supplierGroups[rootIndex].targets.unshift({
        targetId: name,
        hasBrokerIcon: false,
      });
      this.supplierGroups.unshift({
        name,
        logo,
        id: name,
        isRoot: true,
        isTier: false,
        label: '',
        icon: '',
        orderSupplierId: name,
        targets: [],
        type: null,
      });
    }
  }

  async getOrderDetail(): Promise<void> {
    try {
      this.orderDetail = await getOrderDetail(this.orderId);
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  async getSupplyChainTiers(): Promise<void> {
    try {
      this.tiers = await getSupplyChainTiers({ doesAddBrand: true });
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  back(): void {
    this.$router.push({ name: 'BrandProductOrder' });
  }

  trace(): void {
    this.isTracing = false;
    this.initData();
  }

  scrollToTracingResult(): void {
    this.$nextTick(() => {
      if (
        this.dashboardLayout &&
        this.tracingResult &&
        this.tracingResult.$el
      ) {
        this.dashboardLayout.scrollToPosition(
          (this.tracingResult.$el as HTMLElement).offsetTop,
        );
      }
    });
  }

  toggleOrderDetail(): void {
    this.isShowDetail = !this.isShowDetail;
  }

  openEditModal(supplier: BrandSupplier.SupplierItem, isEdit: boolean): void {
    if (isEdit && supplier.isRoot) {
      this.showBrandOrderModal(this.orderDetail.supplier);
    } else {
      this.showOrderSupplierModal(supplier, isEdit);
    }
  }

  showOrderSupplierModal(
    supplier: BrandSupplier.SupplierItem,
    isEdit: boolean,
  ) {
    this.$modal.show(
      OrderSupplierModal,
      {
        onSuccess: this.initData,
        supplier,
        isEdit,
      },
      {
        width: '524px',
        height: 'auto',
        clickToClose: false,
        scrollable: true,
        adaptive: true,
      },
    );
  }

  showBrandOrderModal(supplier: Auth.Facility): void {
    this.$modal.show(
      BrandOrderModal,
      {
        supplier,
        isEditModal: true,
        order: this.orderDetail,
        onSuccess: this.initData,
        onDeleteOrder: () => this.showConfirmDeleteModal(this.orderId),
        addSupplier: this.showBrandSupplierModal,
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

  showBrandSupplierModal(): void {
    this.$modal.show(
      BrandSupplierModal,
      {
        onSuccess: () => {
          this.showBrandOrderModal(this.orderDetail.supplier);
        },
        onClose: () => {
          this.showBrandOrderModal(this.orderDetail.supplier);
        },
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

  showConfirmDeleteModal(orderId: string): void {
    this.$modal.show(
      ConfirmModal,
      {
        icon: 'delete_forever',
        iconSize: '44',
        message: this.$t('deleteOrderModal.message'),
        note: this.$t('this_action_cannot_be_undone'),
        confirmLabel: this.$t('common.action.yes_delete'),
        confirmButtonVariant: 'danger',
        cancelLabel: this.$t('common.action.cancel'),
        onConfirm: () => this.onDelete(orderId),
      },
      { width: '351px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  async onDelete(orderId: string): Promise<void> {
    try {
      await deleteOrder(orderId);
      this.$toast.success(this.$t('brandOrderModal.deleted_success'));
      this.$router.push({ name: 'BrandProductOrder' });
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  openDetailModal(supplier: BrandSupplier.SupplierItem): void {
    const { id, label, logo } = supplier;
    const isBroker = label.toLowerCase() === UserRoleEnum.BROKER.toLowerCase();
    if (auth.hasViewSupplierDetail && id && !isBroker && !logo) {
      this.currentSupplierId = id;
    }
  }

  setCurrentSupplierId(value: string = null): void {
    this.currentSupplierId = value;
  }

  renderHeader(): JSX.Element {
    return (
      <Styled.HeaderWrapper>
        <Styled.Header>
          <Styled.Back vOn:click={this.back}>
            <font-icon name="arrow_left" color="highland" size="14" />
            <Styled.Label>
              {this.$t('brandOrderPage.back_to_list_orders')}
            </Styled.Label>
          </Styled.Back>
          {this.orderDetail && (
            <Styled.Information>
              <text-direction>
                <Styled.InformationTitle
                  domProps={{
                    innerHTML: this.orderTitle,
                  }}
                />
              </text-direction>
              <Styled.InformationAction
                vOn:click={this.toggleOrderDetail}
                isShowDetail={this.isShowDetail}
              >
                {this.headerActionTitle}
                <font-icon name="expand_more" size="20" color="abbey" />
              </Styled.InformationAction>
            </Styled.Information>
          )}
          <Button
            type="button"
            variant="primary"
            disabled={this.disabledTrace}
            label={this.$t('brandOrderPage.begin_trace')}
            click={this.trace}
          />
        </Styled.Header>
        {this.orderDetail && this.isShowDetail && (
          <Information orderDetail={this.orderDetail} />
        )}
      </Styled.HeaderWrapper>
    );
  }

  renderTracingResult(): JSX.Element {
    return (
      <Styled.TracingContent ref="tracingResult">
        <TracingResult
          orderDetail={this.orderDetail}
          producerName={this.orderDetail.supplier.name}
          currentSupplierId={this.currentSupplierId}
          closeSupplierDetail={() => {
            this.setCurrentSupplierId();
          }}
          changeCurrentSupplierId={this.setCurrentSupplierId}
        />
      </Styled.TracingContent>
    );
  }

  render(): JSX.Element {
    return (
      <dashboard-layout ref="dashboardLayout">
        <Styled.Wrapper>
          {this.renderHeader()}
          <Styled.Content>
            {this.isLoading && <SpinLoading />}
            {!this.isLoading && (
              <fragment>
                <TraceOrderMap
                  tiers={this.tiers}
                  isEdit={this.isTracing}
                  size={this.isTracing ? 'default' : 'small'}
                  direction="left"
                  data={this.supplierGroups}
                  canEditSupplierIds={this.canEditSupplierIds}
                  editSupplier={this.openEditModal}
                  clickSupplier={(supplier: BrandSupplier.SupplierItem) => {
                    this.openDetailModal(supplier);
                  }}
                />
                {!this.isTracing && this.renderTracingResult()}
              </fragment>
            )}
          </Styled.Content>
        </Styled.Wrapper>
        {this.currentSupplierId && (
          <SupplierDetail
            supplierId={this.currentSupplierId}
            close={() => {
              this.setCurrentSupplierId();
            }}
          />
        )}
      </dashboard-layout>
    );
  }
}
