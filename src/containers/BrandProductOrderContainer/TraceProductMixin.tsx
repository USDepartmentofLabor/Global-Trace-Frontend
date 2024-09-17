import { Vue, Component } from 'vue-property-decorator';
import { handleError } from 'components/Toast';
import { deleteOrder } from 'api/brand-orders';
import brandProductOrderModule from 'store/modules/brand-product-order';
import { SpinLoading } from 'components/Loaders';
import DataTable from 'components/DataTable';
import Button from 'components/FormUI/Button';
import ProductOrder from './elements/ProductOrder';
import * as Styled from './styled';

const BrandOrderModal = () => import('modals/BrandOrderModal');
const BrandSupplierModal = () => import('modals/BrandSupplierModal');
const ConfirmModal = () => import('modals/ConfirmModal');

@Component
export default class TraceProductMixin extends Vue {
  public isLoading: boolean = false;
  private isGetting: boolean = false;
  private supplier: Auth.Facility = null;
  private order: BrandProduct.Order = null;
  private sortInfo: App.SortInfo = {
    sort: 'DESC',
    sortKey: 'createdAt',
  };
  private pagination: App.Pagination = {
    total: null,
    lastPage: 1,
    perPage: 20,
    currentPage: 1,
  };

  get hasData(): boolean {
    return brandProductOrderModule.items.length > 0;
  }

  get columns(): App.DataTableColumn[] {
    return [
      {
        label: this.$t('purchase_order_number'),
        field: 'id',
        sortable: false,
      },
      {
        label: this.$t('last_update'),
        field: 'updatedAt',
        sortable: true,
        sortKey: 'updatedAt',
      },
      {
        label: this.$t('brandOrderPage.product_description'),
        field: 'productDescription',
        width: '282px',
        sortable: false,
      },
      {
        label: this.$t('brandOrderPage.quantity'),
        field: 'quantity',
        sortable: false,
      },
      {
        label: '',
        field: '',
      },
      {
        label: '',
        field: '',
      },
    ];
  }

  created(): void {
    this.getOrders(true);
  }

  reloadData(): void {
    this.sortInfo = {
      sort: 'DESC',
      sortKey: 'createdAt',
    };
    this.getOrders(false);
  }

  resetData(): void {
    this.pagination.currentPage = 1;
    this.supplier = null;
    this.order = null;
  }

  getOrders(isFirstLoad: boolean): void {
    this.isLoading = isFirstLoad;
    this.isGetting = true;
    const params = {
      page: this.pagination.currentPage,
      perPage: this.pagination.perPage,
      sortFields: `${this.sortInfo.sortKey}:${this.sortInfo.sort}`,
    };
    brandProductOrderModule.getOrderList({
      params,
      callback: {
        onSuccess: () => {
          this.pagination = {
            total: brandProductOrderModule.total,
            lastPage: brandProductOrderModule.lastPage,
            currentPage: brandProductOrderModule.currentPage,
            perPage: brandProductOrderModule.perPage,
          };
        },
        onFailure: (error: App.ResponseError) => {
          handleError(error);
        },
        onFinish: () => {
          this.isGetting = false;
          this.isLoading = false;
        },
      },
    });
  }

  onTrace(id: string): Promise<void> {
    return new Promise((resolve) => {
      this.$router.push({
        name: 'BrandProductTrace',
        params: { id },
      });
      resolve();
    });
  }

  async onDelete(orderId: string): Promise<void> {
    try {
      await deleteOrder(orderId);
      this.$toast.success(this.$t('brandOrderModal.deleted_success'));
      this.reloadData();
    } catch (error) {
      handleError(error as App.ResponseError);
    }
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

  showBrandOrderModal(isEditModal: boolean = false): void {
    this.$modal.show(
      BrandOrderModal,
      {
        isEditModal,
        supplier: this.supplier,
        order: this.order,
        onSuccess: isEditModal
          ? this.reloadData
          : this.showAddOrderSuccessModal,
        onDeleteOrder: () => this.showConfirmDeleteModal(this.order.id),
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
        onClose: this.reloadData,
      },
      { width: '424px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  showBrandSupplierModal(isEditModal: boolean): void {
    this.$modal.show(
      BrandSupplierModal,
      {
        acceptAllTier: false,
        onSuccess: (supplier: Auth.Facility) => {
          this.supplier = supplier;
          this.showBrandOrderModal(isEditModal);
        },
        onClose: () => this.showBrandOrderModal(isEditModal),
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

  onChangeOrder(order: BrandProduct.Order): void {
    this.order = order;
  }

  onChangeSupplier(supplier: Auth.Facility): void {
    this.supplier = supplier;
  }

  sortColumn(key: string, type: string): void {
    this.sortInfo = {
      sort: type,
      sortKey: key,
    };
    this.getOrders(false);
  }

  pageOnChange(page: number): void {
    this.pagination.currentPage = page;
    this.getOrders(false);
  }

  renderHeader(): JSX.Element {
    return (
      <Styled.Header>
        <Button
          label={this.$t('brandOrderPage.add_new_order')}
          width="294px"
          click={() => {
            this.resetData();
            this.showBrandOrderModal();
          }}
        />
        <Styled.TotalOrders>
          {this.$t('brandOrderPage.all_orders', {
            count: this.pagination.total,
          })}
        </Styled.TotalOrders>
      </Styled.Header>
    );
  }

  renderDataTable(): JSX.Element {
    return (
      <Styled.Content>
        {this.renderHeader()}
        <DataTable
          numberRowLoading={10}
          isLoading={this.isGetting}
          columns={this.columns}
          data={brandProductOrderModule.items}
          pagination={this.pagination}
          sortColumn={this.sortColumn}
          pageOnChange={this.pageOnChange}
          scopedSlots={{
            tableRow: ({ item }: { item: BrandProduct.Order }) => (
              <ProductOrder
                order={item}
                editOrder={(order: BrandProduct.Order) => {
                  this.order = order;
                  this.showBrandOrderModal(true);
                }}
              />
            ),
          }}
        />
      </Styled.Content>
    );
  }

  renderAddNewOrder(): JSX.Element {
    return (
      <Styled.EmptyContainer>
        <Styled.EmptyImage />
        <Styled.EmptyText>
          {this.$t('product_order_empty_message')}
        </Styled.EmptyText>
        <Styled.AddNewOrder>
          <Button
            label={this.$t('brandOrderPage.add_new_order')}
            width="294px"
            click={() => {
              this.resetData();
              this.showBrandOrderModal();
            }}
          />
        </Styled.AddNewOrder>
      </Styled.EmptyContainer>
    );
  }

  renderLoading(): JSX.Element {
    return (
      <Styled.EmptyContainer>
        <SpinLoading />
      </Styled.EmptyContainer>
    );
  }
}
