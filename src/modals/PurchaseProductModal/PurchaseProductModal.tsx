/* eslint-disable max-lines */
import { Vue, Component, Prop } from 'vue-property-decorator';
import { head, orderBy, isEmpty, debounce } from 'lodash';
import QRCodeScanner from 'utils/qrcode-scanner';
import { SortType } from 'enums/app';
import {
  getPurchasedProductDefinitions,
  getPurchaseProduct,
} from 'api/purchase';
import { validProductId, getProductId } from 'utils/product-attributes';
import auth from 'store/modules/auth';
import { handleError } from 'components/Toast';
import Button from 'components/FormUI/Button';
import { SpinLoading } from 'components/Loaders';
import InputProductCode from 'components/FormUI/Input/InputProductCode';
import CameraPreview from 'components/CameraPreview';
import SelectOutputProduct from 'components/SelectOutputProduct';
import { updateModalWidth } from 'utils/helpers';
import { AddProductViewTypeEnum } from 'enums/product';
import AddManuallyForm from './elements/AddManuallyForm';
import Filter from './elements/Filter/Filter';
import * as Styled from './styled';
import Product from './elements/Product';

@Component
export default class PurchaseProductModal extends Vue {
  @Prop({ default: [] }) readonly productsDefault: Purchase.Product[];
  @Prop({
    default: () => {
      //
    },
  })
  onSuccess: (products: Purchase.Product[]) => void;

  private products: Purchase.Product[] = [];
  private QRCodeScanner: QRCodeScanner;
  private qrPreviewId = 'qrPreview';
  private showCameraPreview: boolean = false;
  private viewType: AddProductViewTypeEnum =
    AddProductViewTypeEnum.ADD_PRODUCTS;
  private search: string = '';
  private filters: Purchase.LotFilterParams = {
    lotId: SortType.DESC,
    createdAt: SortType.DESC,
    code: SortType.DESC,
  };
  private isLoading: boolean = false;

  get titleModal(): string {
    switch (this.viewType) {
      case AddProductViewTypeEnum.ADD_PRODUCTS:
        return this.$t('add_item', { item: this.$t('products') });
      case AddProductViewTypeEnum.SELECT_OUTPUT_PRODUCT:
        return this.$t('select_input_product');
      case AddProductViewTypeEnum.ADD_PRODUCT_MANUALLY:
        return this.$t('add_products_manually');
    }
  }

  get showBack(): boolean {
    return (
      this.viewType === AddProductViewTypeEnum.SELECT_OUTPUT_PRODUCT ||
      this.viewType === AddProductViewTypeEnum.ADD_PRODUCT_MANUALLY
    );
  }

  get isDisabledAddLot(): boolean {
    return this.isLoading || isEmpty(this.search);
  }

  get isDisabled(): boolean {
    return this.products.length == 0;
  }

  get showProductInput(): boolean {
    return (
      auth.hasInputProductIdOfLogPurchase || auth.hasScanQRCodeOfLogPurchase
    );
  }

  created(): void {
    this.products = this.productsDefault;
    this.getProduct = debounce(this.getProduct, 500);
  }

  mounted(): void {
    setTimeout(() => {
      this.QRCodeScanner = new QRCodeScanner(this.qrPreviewId);
    }, 100);
    this.gotoAddManually();
  }

  gotoAddManually() {
    this.viewType = auth.onlyManuallyDefineNewProduct
      ? AddProductViewTypeEnum.SELECT_OUTPUT_PRODUCT
      : AddProductViewTypeEnum.ADD_PRODUCTS;
  }

  closeModal(): void {
    if (
      [
        AddProductViewTypeEnum.SELECT_OUTPUT_PRODUCT,
        AddProductViewTypeEnum.ADD_PRODUCT_MANUALLY,
      ].includes(this.viewType)
    ) {
      this.updateViewType(AddProductViewTypeEnum.ADD_PRODUCTS);
    } else {
      this.$emit('close');
      this.stopScanProductId();
    }
  }

  back() {
    switch (this.viewType) {
      case AddProductViewTypeEnum.ADD_PRODUCT_MANUALLY:
        this.updateViewType(AddProductViewTypeEnum.SELECT_OUTPUT_PRODUCT);
        break;
      case AddProductViewTypeEnum.SELECT_OUTPUT_PRODUCT:
        this.updateViewType(AddProductViewTypeEnum.ADD_PRODUCTS);
        break;
    }
  }

  onAddManually(product: Purchase.Product): void {
    if (validProductId(getProductId(product), this.products)) {
      this.products.push({
        ...product,
        isManualAdded: true,
      });
      this.updateViewType(AddProductViewTypeEnum.ADD_PRODUCTS);
      this.$toast.success(
        this.$t('add_success', { field: this.$t('product') }),
      );
    } else {
      this.$toast.error(this.$t('duplicate_product_id'));
    }
  }

  changeSearchInput(value: string): void {
    this.search = value;
  }

  updateProduct(product: Purchase.Product, index: number): void {
    if (index > -1) {
      this.$toast.error(this.$t('duplicate_product_id'));
    } else {
      this.products.unshift(product);
    }
  }

  async getProduct(): Promise<void> {
    this.isLoading = true;
    try {
      const product = await getPurchaseProduct(this.search);
      product.attributes = product.additionalAttributes;
      const index = this.products.findIndex(({ id }) => id === product.id);
      this.updateProduct(product, index);

      this.search = '';
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  addProduct(): void {
    this.getProduct();
  }

  handleSuccess(): void {
    this.$toast.success(
      this.$t('add_success', {
        item: this.$t('product'),
      }),
    );
    if (this.onSuccess) {
      this.onSuccess(this.products);
    }
    this.closeModal();
  }

  changeSortFilter(key: string): void {
    this.filters[key] =
      this.filters[key] === SortType.ASC ? SortType.DESC : SortType.ASC;
    const productOrder = orderBy(this.products, [key], [this.filters[key]]);
    this.products = productOrder;
  }

  removeProduct(index: number): void {
    this.products.splice(index, 1);
  }

  async getCameraId(): Promise<string> {
    try {
      const cameraDevices = await this.QRCodeScanner.getCameras();
      return head(cameraDevices).id;
    } catch (error) {
      this.$toast.error(this.$t('camera_not_found'));
    }
  }

  async scanLotId(): Promise<void> {
    const cameraId = await this.getCameraId();
    if (cameraId && !this.showCameraPreview) {
      this.showCameraPreview = true;
      this.QRCodeScanner.scanQRCode(cameraId, (text: string) => {
        this.search = text;
        this.stopScanProductId();
      });
    }
  }

  stopScanProductId(): void {
    this.showCameraPreview = false;
    this.QRCodeScanner && this.QRCodeScanner.stop();
  }

  updateViewType(viewType: AddProductViewTypeEnum) {
    this.viewType = viewType;
    this.updateModalWidth();
  }

  updateModalWidth() {
    switch (this.viewType) {
      case AddProductViewTypeEnum.SELECT_OUTPUT_PRODUCT:
        updateModalWidth(this.$el, 640);
        break;
      default:
        updateModalWidth(this.$el, 800);
        break;
    }
  }

  renderInputProduct(): JSX.Element {
    return (
      <Styled.InputProductCode>
        <InputProductCode
          label={this.$t('product_id')}
          name="lotId"
          height="48px"
          value={this.search}
          keepDash
          maxLength={19}
          placeholder={this.$t('product_id')}
          suffixIcon={auth.hasScanQRCodeOfLogPurchase ? 'qr_code' : null}
          changeValue={this.changeSearchInput}
          clickSuffixIcon={this.scanLotId}
        />
      </Styled.InputProductCode>
    );
  }

  renderHeader() {
    return (
      <Styled.Header>
        {auth.onlyManuallyDefineNewProduct && (
          <Styled.ProductManually>
            <Button
              width="100%"
              type="button"
              variant="primary"
              label={this.$t('add_products_manually')}
              click={() => {
                this.updateViewType(
                  AddProductViewTypeEnum.SELECT_OUTPUT_PRODUCT,
                );
              }}
            />
          </Styled.ProductManually>
        )}
        {!auth.onlyManuallyDefineNewProduct && (
          <fragment>
            <Styled.Col>
              <Styled.HeaderInputGroup>
                {this.showProductInput && this.renderInputProduct()}
                <Button
                  type="button"
                  variant="primary"
                  label={this.$t('Add')}
                  disabled={this.isDisabledAddLot}
                  click={this.addProduct}
                />
              </Styled.HeaderInputGroup>
              {auth.hasManuallyDefineNewProduct && (
                <Styled.AddManually
                  vOn:click={() => {
                    this.updateViewType(
                      AddProductViewTypeEnum.SELECT_OUTPUT_PRODUCT,
                    );
                  }}
                >
                  {this.$t('add_product_manually')}
                  <font-icon name="chevron_right" size="16" />
                </Styled.AddManually>
              )}
            </Styled.Col>
          </fragment>
        )}
      </Styled.Header>
    );
  }

  renderFilter(): JSX.Element {
    return (
      <Filter filters={this.filters} changeSortFilter={this.changeSortFilter} />
    );
  }

  renderContent(): JSX.Element {
    return (
      <Styled.Content isEmpty={this.products.length === 0}>
        <perfect-scrollbar>
          {this.products.map((product, index) => (
            <Styled.Box>
              <Product
                product={product}
                index={index}
                removeProduct={this.removeProduct}
              />
            </Styled.Box>
          ))}
        </perfect-scrollbar>
      </Styled.Content>
    );
  }

  renderFooter() {
    return (
      <Styled.Actions>
        <Styled.ButtonGroupEnd>
          <Button
            label={this.$t('common.action.cancel')}
            variant="transparentPrimary"
            click={this.closeModal}
          />
          <Button
            type="button"
            variant="primary"
            label={this.$t('done')}
            disabled={this.isLoading || this.isDisabled}
            click={this.handleSuccess}
          />
        </Styled.ButtonGroupEnd>
      </Styled.Actions>
    );
  }

  renderCameraPreview(): JSX.Element {
    return (
      <CameraPreview
        qrPreviewId={this.qrPreviewId}
        show={this.showCameraPreview}
        stopScan={this.stopScanProductId}
      />
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout
        title={this.titleModal}
        closeModal={this.closeModal}
        showBack={this.showBack}
        back={this.back}
      >
        {this.renderCameraPreview()}
        {this.viewType === AddProductViewTypeEnum.ADD_PRODUCTS && (
          <fragment>
            {this.renderHeader()}
            {this.renderFilter()}
            {this.renderContent()}
            {this.renderFooter()}
          </fragment>
        )}
        {this.viewType === AddProductViewTypeEnum.SELECT_OUTPUT_PRODUCT && (
          <SelectOutputProduct
            request={getPurchasedProductDefinitions}
            select={() => {
              this.updateViewType(AddProductViewTypeEnum.ADD_PRODUCT_MANUALLY);
            }}
          />
        )}
        {this.viewType === AddProductViewTypeEnum.ADD_PRODUCT_MANUALLY && (
          <AddManuallyForm
            successAdded={this.onAddManually}
            cancel={this.back}
          />
        )}
        {this.isLoading && <SpinLoading isInline={false} />}
      </modal-layout>
    );
  }
}
