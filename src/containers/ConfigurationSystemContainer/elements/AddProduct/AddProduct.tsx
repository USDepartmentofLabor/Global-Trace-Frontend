/* eslint-disable max-lines-per-function */
import { Vue, Component } from 'vue-property-decorator';
import { get, isEmpty, orderBy } from 'lodash';
import { SpinLoading } from 'components/Loaders';
import { handleError } from 'components/Toast';
import AppModule from 'store/modules/app';
import productModule from 'store/modules/product';
import DataTable from 'components/DataTable/DataTable';
import Button from 'components/FormUI/Button';
import Input from 'components/FormUI/Input/Input';
import { deleteProduct } from 'api/product-management';
import { formatDate } from 'utils/date';
import * as Styled from './styled';

const ConfigProductModal = () => import('modals/ConfigProductModal');
const ConfirmModal = () => import('modals/ConfirmModal');
const UploadTranslateFileModal = () =>
  import('modals/UploadTranslateFileModal');

@Component
export default class AddProduct extends Vue {
  private isLoading = true;
  private isEmptyData: boolean = false;
  private data: ProductManagement.Product[] = [];
  private search: string = '';
  private sortInfo: App.SortInfo = {
    sortKey: 'updatedAt',
    sort: 'desc',
  };

  get columns(): App.DataTableColumn[] {
    return [
      {
        label: this.$t('product'),
        field: 'name',
        sortable: true,
        sortKey: 'name',
      },
      {
        label: this.$t('product_attribute'),
        field: 'productAttribute',
      },
      {
        label: this.$t('last_update'),
        field: 'updatedAt',
        sortable: true,
        sortKey: 'updatedAt',
      },
      {
        label: '',
        field: '',
        width: '70px',
      },
    ];
  }

  get tableData(): ProductManagement.Product[] {
    let data: ProductManagement.Product[] = this.data;
    if (this.search) {
      data = data.filter(({ name, nameTranslation }) => {
        const nameValue = get(nameTranslation, this.currentLocale) || name;
        return nameValue.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
      });
    }
    data = orderBy(data, [this.sortInfo.sortKey], [this.sortInfo.sort]);
    return data;
  }

  get currentLocale(): string {
    return AppModule.locale;
  }

  created() {
    this.initData();
  }

  initData(): void {
    this.getList();
  }

  handleInputSearch(value: string): void {
    this.search = value;
  }

  async getList() {
    productModule.getProductList({
      callback: {
        onSuccess: () => {
          this.data = productModule.products;
          this.isEmptyData = isEmpty(this.data);
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

  sortColumn(key: string, type: string): void {
    this.sortInfo = {
      sort: type,
      sortKey: key,
    };
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      await deleteProduct(productId);
      this.initData();
      this.$toast.success(this.$t('successfully_deleted'));
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  openConfigProductModal(item: ProductManagement.Product = null) {
    this.$modal.show(
      ConfigProductModal,
      {
        product: item,
        onSuccess: this.initData,
      },
      {
        name: 'ConfigProductModal',
        width: '776px',
        height: 'auto',
        clickToClose: false,
      },
    );
  }

  openDeleteModal(product: ProductManagement.Product): void {
    this.$modal.show(
      ConfirmModal,
      {
        icon: 'delete',
        iconSize: '44',
        message: this.$t('delete_product_message'),
        note: this.$t('this_action_cannot_be_undone'),
        confirmLabel: this.$t('common.action.yes_delete'),
        confirmButtonVariant: 'danger',
        cancelLabel: this.$t('common.action.cancel'),
        onConfirm: () => this.deleteProduct(product.id),
      },
      { width: '410px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  openUploadTranslateFileModal(): void {
    this.$modal.show(
      UploadTranslateFileModal,
      {
        onSuccess: this.initData,
      },
      {
        name: 'UploadTranslateFileModal',
        classes: 'fromRight',
        styles: 'border-radius: 0;',
        width: 600,
        height: '100%',
        shiftX: 1,
        clickToClose: false,
      },
    );
  }

  renderEmptyData(): JSX.Element {
    return (
      <Styled.EmptyContainer>
        <Styled.EmptyImage />
        <Styled.EmptyText>{this.$t('no_product')}</Styled.EmptyText>
        <Styled.EmptyActions>
          <Button
            width="100%"
            type="button"
            label={this.$t('define_new_product')}
            click={this.openConfigProductModal}
          />
        </Styled.EmptyActions>
      </Styled.EmptyContainer>
    );
  }

  renderRowItem(item: ProductManagement.Product): JSX.Element {
    return (
      <Styled.Tr>
        <Styled.Td>
          {get(item, `nameTranslation.${this.currentLocale}`) || item.name}
        </Styled.Td>
        <Styled.Td>
          <Styled.ProductAttributes>
            {item.productDefinitionAttributes.map(({ attribute }) => (
              <span>
                {get(attribute, `nameTranslation.${this.currentLocale}`) ||
                  attribute.name}
              </span>
            ))}
          </Styled.ProductAttributes>
        </Styled.Td>
        <Styled.Td>{formatDate(item.updatedAt)}</Styled.Td>
        {this.renderActions(item)}
      </Styled.Tr>
    );
  }

  renderActions(item: ProductManagement.Product): JSX.Element {
    return (
      <Styled.Td>
        <Styled.RowActions>
          <Button
            label={this.$t('edit')}
            icon="edit"
            variant="transparentSecondary"
            size="small"
            iconSize="20"
            click={() => {
              this.openConfigProductModal(item);
            }}
          />
          <Button
            label={this.$t('common.action.remove')}
            icon="delete"
            variant="transparentSecondary"
            size="small"
            iconSize="20"
            click={() => {
              this.openDeleteModal(item);
            }}
          />
        </Styled.RowActions>
      </Styled.Td>
    );
  }

  renderTableHeader(): JSX.Element {
    return (
      <Styled.TableHeader>
        <Input
          height="40px"
          name="search"
          size="large"
          value={this.search}
          placeholder={this.$t('search_for_product')}
          changeValue={(value: string) => {
            this.handleInputSearch(value);
          }}
          prefixIcon="search"
        />
        <Button
          icon="plus"
          label={this.$t('define_new_product')}
          width="100%"
          click={() => this.openConfigProductModal()}
        />
        <Button
          icon="export"
          label={this.$t('upload_translation')}
          width="100%"
          click={() => this.openUploadTranslateFileModal()}
        />
      </Styled.TableHeader>
    );
  }

  renderTable(): JSX.Element {
    return (
      <DataTable
        numberRowLoading={10}
        isLoading={this.isLoading}
        columns={this.columns}
        data={this.tableData}
        sortInfo={this.sortInfo}
        hasPagination={false}
        sortColumn={this.sortColumn}
        scopedSlots={{
          tableRow: ({ item }: { item: ProductManagement.Product }) =>
            this.renderRowItem(item),
        }}
      />
    );
  }

  renderContent(): JSX.Element {
    if (this.isLoading) {
      return <SpinLoading />;
    }
    if (this.isEmptyData) {
      return this.renderEmptyData();
    }
    return (
      <fragment>
        {this.renderTableHeader()}
        {this.renderTable()}
      </fragment>
    );
  }

  render(): JSX.Element {
    return <Styled.Wrapper>{this.renderContent()}</Styled.Wrapper>;
  }
}
