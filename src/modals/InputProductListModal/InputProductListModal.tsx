import { Vue, Component, Prop } from 'vue-property-decorator';
import { head, isEmpty } from 'lodash';
import auth from 'store/modules/auth';
import QRCodeScanner from 'utils/qrcode-scanner';
import { getInputProduct } from 'api/assign-product';
import { handleError } from 'components/Toast';
import Button from 'components/FormUI/Button';
import InputProductCode from 'components/FormUI/Input/InputProductCode';
import CameraPreview from 'components/CameraPreview';
import Products from './elements/Products';
import * as Styled from './styled';

@Component
export default class InputProductListModal extends Vue {
  @Prop({ default: [] }) readonly productsDefault: AssignProduct.Product[];
  @Prop({
    default: () => {
      //
    },
  })
  onSuccess: (lots: string[]) => void;

  private products: AssignProduct.Product[] = [];
  private QRCodeScanner: QRCodeScanner;
  private qrPreviewId = 'qrPreview';
  private showCameraPreview: boolean = false;
  private code: string = '';
  private isLoading: boolean = false;

  get isDisabledAddLot(): boolean {
    return this.isLoading || isEmpty(this.code);
  }

  get isDisabled(): boolean {
    return this.products.length == 0;
  }

  get invalidMessage(): string {
    return this.$t('invalid_product', { name: this.$t('product') });
  }

  created(): void {
    this.products = this.productsDefault;
  }

  mounted(): void {
    setTimeout(() => {
      this.QRCodeScanner = new QRCodeScanner(this.qrPreviewId);
    }, 100);
  }

  isInvalidLot(lot: AssignProduct.Product): boolean {
    return lot.isTransformed;
  }

  updateProduct(product: AssignProduct.Product, index: number): void {
    if (index > -1) {
      this.$toast.error(this.$t('duplicate_product_id'));
    } else {
      this.products.unshift(product);
    }
  }

  resetData(): void {
    this.code = '';
  }

  async getProductLot(): Promise<void> {
    this.isLoading = true;
    try {
      const product = await getInputProduct(this.code);
      product.lotId = this.code;
      product.attributes = product.additionalAttributes;
      const index = this.products.findIndex(({ id }) => id === product.id);
      if (this.isInvalidLot(product)) {
        this.$toast.error(this.invalidMessage);
      } else {
        this.updateProduct(product, index);
        this.resetData();
      }
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  addLot(): void {
    this.getProductLot();
  }

  closeModal(): void {
    this.$emit('close');
    this.stopScanProductId();
  }

  changeSearchInputCode(value: string): void {
    this.code = value;
  }

  handleSuccess(): void {
    this.$toast.success(
      this.$t('add_success', {
        field: this.$t('products'),
      }),
    );
    this.onSuccess && this.onSuccess(this.products.map(({ id }) => id));
    this.closeModal();
  }

  removeLot(index: number): void {
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
        this.code = text;
        this.stopScanProductId();
      });
    }
  }

  stopScanProductId(): void {
    this.showCameraPreview = false;
    this.QRCodeScanner && this.QRCodeScanner.stop();
  }

  renderInputProductCode(): JSX.Element {
    return (
      <Styled.InputProductCode>
        <InputProductCode
          label={this.$t('product_id')}
          name="lotId"
          maxLength={19}
          height="48px"
          value={this.code}
          placeholder={this.$t('product_id')}
          suffixIcon={auth.hasScanQRCodeOfLogPurchase && 'qr_code'}
          iconColor="highland"
          changeValue={this.changeSearchInputCode}
          clickSuffixIcon={this.scanLotId}
          keepDash
        />
      </Styled.InputProductCode>
    );
  }

  renderHeader(): JSX.Element {
    return (
      <Styled.Header>
        {this.renderInputProductCode()}
        <Button
          type="button"
          variant="primary"
          label={this.$t('add')}
          isLoading={this.isLoading}
          disabled={this.isDisabledAddLot}
          click={this.addLot}
        />
      </Styled.Header>
    );
  }

  renderContent(): JSX.Element {
    return (
      <Styled.Content>
        <Products defaultProducts={this.products} />
      </Styled.Content>
    );
  }

  renderFooter(): JSX.Element {
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
        title={this.$t('add_input_products')}
        closeModal={this.closeModal}
      >
        {this.renderCameraPreview()}
        <Styled.Wrapper>
          {this.renderHeader()}
          {this.renderContent()}
          {this.renderFooter()}
        </Styled.Wrapper>
      </modal-layout>
    );
  }
}
