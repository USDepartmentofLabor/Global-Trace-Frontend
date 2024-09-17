import { Component, Prop, Vue } from 'vue-property-decorator';
import { head, isNull, isUndefined } from 'lodash';
import AppModule from 'store/modules/app';
import { InputType, InputAttributeEnum } from 'enums/app';
import { getAttributeProperties } from 'utils/product-attributes';
import { ProductAttributeTypeEnum } from 'enums/product';
import Input from 'components/FormUI/Input';
import InputProductCode from 'components/FormUI/Input/InputProductCode';
import CameraPreview from 'components/CameraPreview';
import auth from 'store/modules/auth';
import MessageError from 'components/FormUI/MessageError';
import QRCodeScanner from 'utils/qrcode-scanner';
import * as Styled from './styled';

@Component
export default class AttributeInput extends Vue {
  @Prop({ required: true }) readonly isOutputProduct: boolean;
  @Prop({ required: true }) isSubmitting: boolean;
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({ required: true })
  productAttribute: ProductAttribute.ProductDefinitionAttribute;
  @Prop() change: (params: ProductAttribute.AttributeParams) => void;
  @Prop({
    default: () => {
      //
    },
  })
  changeCode: (code: string) => void;

  private qrCode: string = '';
  private value: string | number = null;
  private QRCodeScanner: QRCodeScanner;
  private qrPreviewId = 'qrPreview';
  private showCameraPreview: boolean = false;

  get attributeProperties(): ProductAttribute.Entity {
    return getAttributeProperties(this.productAttribute);
  }

  get isPercentage(): boolean {
    return this.attributeProperties.category === InputAttributeEnum.PERCENTAGE;
  }

  get suffixIcon(): string {
    return this.isPercentage ? 'percent' : '';
  }

  get isProductId(): boolean {
    return (
      this.attributeProperties.type === ProductAttributeTypeEnum.PRODUCT_ID
    );
  }

  get isShowQRCode(): boolean {
    return this.isOutputProduct && auth.hasAssignQRCode && this.isProductId;
  }

  get validateRules(): string {
    if (!this.attributeProperties.isOptional) {
      return this.isPercentage
        ? 'bail|required|max:100|min:0'
        : 'bail|required';
    }
    return null;
  }

  get currentLocale(): string {
    return AppModule.locale;
  }

  get inputType(): InputType {
    return this.attributeProperties.category === InputAttributeEnum.TEXT ||
      this.attributeProperties.category === InputAttributeEnum.UNIQUE_ID
      ? InputType.TEXT
      : InputType.NUMBER;
  }

  created() {
    if (!isUndefined(this.productAttribute.value)) {
      this.value = this.productAttribute.value;
    }
  }

  mounted(): void {
    if (this.isShowQRCode) {
      setTimeout(() => {
        this.QRCodeScanner = new QRCodeScanner(this.qrPreviewId);
      }, 100);
    }
  }

  onChange(value: string | number) {
    this.value = value;
    this.change({
      isOptional: this.attributeProperties.isOptional,
      category: this.attributeProperties.category,
      type: this.attributeProperties.type,
      id: this.attributeProperties.id,
      value:
        !isNull(value) && this.inputType === InputType.NUMBER
          ? Number(this.value)
          : this.value,
    });
  }

  changeQrCode(value: string): void {
    this.qrCode = value;
    this.onChange(value);
    this.changeCode(value);
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
        this.qrCode = text;
        this.onChange(this.qrCode);
        this.stopScanProductId();
      });
    }
  }

  stopScanProductId(): void {
    this.showCameraPreview = false;
    this.QRCodeScanner && this.QRCodeScanner.stop();
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

  renderProductId(): JSX.Element {
    return (
      <InputProductCode
        height="48px"
        name={this.attributeProperties.id}
        label={this.attributeProperties.label}
        placeholder={this.attributeProperties.label}
        maxLength={19}
        validation={this.validateRules}
        validationMessages={{
          required: this.$t('validation.required', {
            field: this.attributeProperties.label,
          }),
        }}
        vOn:input={this.onChange}
      />
    );
  }

  renderInput(): JSX.Element {
    if (this.isProductId) {
      return this.renderProductId();
    }
    return (
      <Input
        name={this.attributeProperties.id}
        value={this.value}
        type={this.inputType}
        step=".1"
        label={this.attributeProperties.label}
        placeholder={this.attributeProperties.label}
        validation={this.validateRules}
        disabled={this.isSubmitting}
        height="48px"
        changeValue={this.onChange}
        validationMessages={{
          required: this.$t('validation.required', {
            field: this.attributeProperties.name.toLowerCase(),
          }),
          max: this.$t('validation.max', {
            field: this.attributeProperties.name,
            number: 100,
          }),
          min: this.$t('validation.min', {
            field: this.attributeProperties.name,
            compare_field: 0,
          }),
        }}
        iconSize="14"
        suffixIcon={this.suffixIcon}
      />
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Attribute>
        {!this.isShowQRCode && this.renderInput()}
        {this.isShowQRCode && (
          <fragment>
            {this.renderCameraPreview()}
            <InputProductCode
              label={this.attributeProperties.label}
              name={this.attributeProperties.id}
              height="48px"
              value={this.qrCode}
              keepDash
              maxLength={19}
              placeholder={this.attributeProperties.label}
              suffixIcon="qr_code"
              changeValue={this.changeQrCode}
              clickSuffixIcon={this.scanProductId}
            />
          </fragment>
        )}

        {this.messageErrors && (
          <Styled.Error>
            <MessageError
              field={this.attributeProperties.id}
              messageErrors={this.messageErrors}
            />
          </Styled.Error>
        )}
      </Styled.Attribute>
    );
  }
}
