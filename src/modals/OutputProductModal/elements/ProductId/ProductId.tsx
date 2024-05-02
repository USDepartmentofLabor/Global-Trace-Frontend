import { Vue, Component, Prop } from 'vue-property-decorator';
import { head } from 'lodash';
import QRCodeScanner from 'utils/qrcode-scanner';
import { InputType } from 'enums/app';
import InputProductCode from 'components/FormUI/Input/InputProductCode';
import CameraPreview from 'components/CameraPreview';

@Component
export default class ProductId extends Vue {
  @Prop({ required: true }) changeCode: (value: string) => void;

  private productId: string = '';
  private QRCodeScanner: QRCodeScanner;
  private qrPreviewId = 'qrPreview';
  private showCameraPreview: boolean = false;

  mounted(): void {
    setTimeout(() => {
      this.QRCodeScanner = new QRCodeScanner(this.qrPreviewId);
    }, 100);
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
        this.productId = text;
        this.changeCode(text);
        this.stopScanProductId();
      });
    }
  }

  stopScanProductId(): void {
    this.showCameraPreview = false;
    this.QRCodeScanner && this.QRCodeScanner.stop();
  }

  onChangeValue(value: string) {
    this.productId = value;
    this.changeCode(this.productId);
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
      <fragment>
        {this.renderCameraPreview()}
        <InputProductCode
          label={this.$t('product_id')}
          placeholder={this.$t('product_id')}
          name="qrCode"
          type={InputType.NUMBER}
          value={this.productId}
          maxLength={19}
          height="48px"
          variant="material"
          changeValue={this.onChangeValue}
          keepDash
          validation="bail|required"
          suffixIcon="qr_code"
          clickSuffixIcon={this.scanProductId}
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('product_id').toLowerCase(),
            }),
          }}
        />
      </fragment>
    );
  }
}
