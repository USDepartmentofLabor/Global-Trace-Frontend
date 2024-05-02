import { Vue, Component, Prop } from 'vue-property-decorator';
import { head, orderBy, isEmpty } from 'lodash';
import QRCodeScanner from 'utils/qrcode-scanner';
import { SortType } from 'enums/app';
import { ProductStatusEnum } from 'enums/product';
import auth from 'store/modules/auth';
import { getSellProduct } from 'api/sell';
import { getTransportProduct } from 'api/transport';
import { SpinLoading } from 'components/Loaders';
import { handleError } from 'components/Toast';
import Button from 'components/FormUI/Button';
import InputProductCode from 'components/FormUI/Input/InputProductCode';
import CameraPreview from 'components/CameraPreview';
import * as Styled from './styled';
import Product from './Product';

@Component
export default class ProductModal extends Vue {
  @Prop({ default: true }) readonly isSell: boolean;
  @Prop({ default: [] }) readonly productsDefault: ProductManagement.Product[];
  @Prop({ required: true }) readonly status: ProductStatusEnum;
  @Prop({
    default: () => {
      //
    },
  })
  onSuccess: (products: ProductManagement.Product[]) => void;

  private products: ProductManagement.Product[] = [];
  private QRCodeScanner: QRCodeScanner;
  private qrPreviewId = 'qrPreview';
  private showCameraPreview: boolean = false;
  private search: string = '';
  private filters: SellProduct.FilterParams = {
    code: SortType.ASC,
    createdAt: SortType.DESC,
  };
  private isLoading: boolean = false;

  get isDisabledAddLot(): boolean {
    return this.isLoading || isEmpty(this.search);
  }

  get isDisabled(): boolean {
    return this.products.length == 0;
  }

  get isSelling(): boolean {
    return this.status === ProductStatusEnum.SELL;
  }

  get isTransporting(): boolean {
    return this.status === ProductStatusEnum.TRANSPORT;
  }

  get hasInputProductID(): boolean {
    return this.isSelling
      ? auth.hasInputProductIdOfLogSale
      : auth.hasInputProductIdOfTransport;
  }

  get hasScanQRCode(): boolean {
    return this.isSelling
      ? auth.hasScanQRCodeOfLogSale
      : auth.hasScanQRCodeOfTransport;
  }

  get showProductInput(): boolean {
    return this.hasInputProductID || this.hasScanQRCode;
  }

  created(): void {
    this.products = this.productsDefault;
  }

  mounted(): void {
    setTimeout(() => {
      this.QRCodeScanner = new QRCodeScanner(this.qrPreviewId);
    }, 100);
  }

  closeModal(): void {
    this.$emit('close');
    this.stopScanProductId();
  }

  changeSearchInput(value: string): void {
    this.search = value;
  }

  updateProduct(product: ProductManagement.Product, index: number): void {
    if (index > -1) {
      this.$toast.error(this.$t('duplicate_product_id'));
    } else {
      this.products.push(product);
    }
  }

  addProduct(): void {
    if (this.search) {
      this.isLoading = true;
      let requestGetProduct;
      if (this.isSell) {
        requestGetProduct = getSellProduct;
      } else {
        requestGetProduct = getTransportProduct;
      }
      requestGetProduct(this.search)
        .then((product: ProductManagement.Product) => {
          const index = this.products.findIndex(
            (item) => item.id === product.id,
          );
          if (this.isSelling && product.isSold) {
            this.$toast.error(this.$t('invalid_sold_product_id'));
          } else if (this.isTransporting && product.isTransported) {
            this.$toast.error(this.$t('product_already_transported'));
          } else {
            this.updateProduct(product, index);
          }
        })
        .catch((error: App.ResponseError) => {
          handleError(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }

  handleSuccess(): void {
    this.$toast.success(
      this.$t('add_success', {
        item: this.$t('product'),
      }),
    );
    this.onSuccess && this.onSuccess(this.products);
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

  async scanProductId(): Promise<void> {
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

  renderInputProduct(): JSX.Element {
    return (
      <Styled.InputProductCode>
        <InputProductCode
          label={this.$t('product_id')}
          name="productId"
          width="100%"
          height="48px"
          variant="material"
          value={this.search}
          keepDash
          maxLength={19}
          placeholder={this.$t('product_id')}
          suffixIcon={this.hasScanQRCode && 'qr_code'}
          changeValue={this.changeSearchInput}
          clickSuffixIcon={this.scanProductId}
        />
      </Styled.InputProductCode>
    );
  }

  renderHeader() {
    return (
      <Styled.Header>
        {this.showProductInput && this.renderInputProduct()}
        <Button
          type="button"
          variant="primary"
          label={this.$t('add')}
          disabled={this.isDisabledAddLot}
          click={this.addProduct}
        />
      </Styled.Header>
    );
  }

  renderFilter(): JSX.Element {
    return (
      <Styled.FilterContainer>
        <Styled.FilterDate
          sortType={this.filters.createdAt}
          vOn:click={() => this.changeSortFilter('createdAt')}
        >
          {this.$t('added_date')} <font-icon name="arrow_dropdown" size="24" />
        </Styled.FilterDate>
        <Styled.FilterWrapper
          sortType={this.filters.code}
          vOn:click={() => this.changeSortFilter('code')}
        >
          {this.$t('product_id')} <font-icon name="arrow_dropdown" size="24" />
        </Styled.FilterWrapper>
        <Styled.FilterWrapper>
          {this.$t('file_and_attachment')}
        </Styled.FilterWrapper>
        <Styled.FilterAction />
      </Styled.FilterContainer>
    );
  }

  renderContent(): JSX.Element {
    return (
      <Styled.Content>
        <perfect-scrollbar>
          {this.products.map((product, index) => {
            return (
              <Product
                product={product}
                index={index}
                removeProduct={this.removeProduct}
              />
            );
          })}
        </perfect-scrollbar>
      </Styled.Content>
    );
  }

  renderFooter() {
    return (
      <Styled.Footer>
        <Button
          width="312px"
          type="button"
          variant="primary"
          label={this.$t('done')}
          disabled={this.isLoading || this.isDisabled}
          click={this.handleSuccess}
        />
      </Styled.Footer>
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
        title={this.$t('product_list')}
        closeModal={this.closeModal}
      >
        {this.hasScanQRCode && this.renderCameraPreview()}
        <Styled.Wrapper>
          {this.renderHeader()}
          <Styled.Container>
            {this.renderFilter()}
            {this.renderContent()}
          </Styled.Container>
          {this.renderFooter()}
          {this.isLoading && <SpinLoading isInline={false} />}
        </Styled.Wrapper>
      </modal-layout>
    );
  }
}
