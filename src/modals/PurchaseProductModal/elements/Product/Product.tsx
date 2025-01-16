import { Vue, Component, Prop } from 'vue-property-decorator';
import { filter, find, flatMap, get, isEmpty, isUndefined } from 'lodash';
import { downloadMultipleFiles } from 'utils/helpers';
import { getShortToken } from 'api/auth';
import { formatDate, currentTimestamp } from 'utils/date';
import { downloadProductAttachmentsUrl } from 'utils/download-helper';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import { InputAttributeEnum } from 'enums/app';
import { ProductAttributeTypeEnum } from 'enums/product';
import * as Styled from './styled';

@Component
export default class Product extends Vue {
  @Prop({ default: [] }) readonly product: Purchase.Product;
  @Prop({ required: true }) readonly index: number;
  @Prop({
    default: () => {
      //
    },
  })
  removeProduct: (index: number) => void;

  private isLoading: boolean = false;

  get addedTime(): string {
    return formatDate(currentTimestamp());
  }

  get productID(): string {
    if (this.product.isManualAdded) {
      const attributeId = find(
        this.product.attributes,
        (attr: Purchase.ManualAddedAttribute) =>
          attr.type === ProductAttributeTypeEnum.PRODUCT_ID,
      );
      return get(attributeId, 'value', '');
    }
    if (this.product.qrCode) {
      return get(this.product, 'qrCode.code');
    }
    return this.product.code;
  }

  get hasAttachments(): boolean {
    const { attributes } = this.product;
    if (this.product.isManualAdded) {
      return attributes.some(
        (attribute) => !isEmpty(get(attribute, 'files', [])),
      );
    }
    const fileAttribute = find(
      attributes,
      (attribute: Purchase.ManualAddedAttribute) =>
        attribute.category === InputAttributeEnum.ATTACHMENTS ||
        get(attribute, 'attribute.category') === InputAttributeEnum.ATTACHMENTS,
    );
    return fileAttribute && !!fileAttribute.value;
  }

  handleDownloadAttachments(): void {
    if (this.productID) {
      this.downloadProductAttachments();
    }
  }

  async downloadProductAttachments(): Promise<void> {
    try {
      if (this.product.isManualAdded) {
        this.downloadAttachmentFromManually();
      } else {
        this.isLoading = true;
        const response = await getShortToken();
        const downloadUrl = downloadProductAttachmentsUrl(
          this.product.id,
          response.shortToken,
        );
        window.open(downloadUrl, '_blank');
      }
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  downloadAttachmentFromManually() {
    const files = filter(
      flatMap(this.product.attributes, 'files'),
      (item) => !isUndefined(item),
    );
    this.isLoading = true;
    downloadMultipleFiles(files, () => {
      this.isLoading = false;
    });
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <Styled.Time>{this.addedTime}</Styled.Time>
        <Styled.Code>{this.productID}</Styled.Code>
        {this.hasAttachments ? (
          <Styled.DownloadAttachments
            onClick={() => this.handleDownloadAttachments()}
          >
            <font-icon name="download" color="envy" size="20" />
            <Styled.DownloadText>{this.$t('download')}</Styled.DownloadText>
          </Styled.DownloadAttachments>
        ) : (
          <Styled.EmptyAttachments />
        )}
        <font-icon
          class="remove-product"
          name="remove"
          size="24"
          color="ghost"
          vOn:click_native={() => this.removeProduct(this.index)}
        />
        {this.isLoading && <SpinLoading isInline={false} />}
      </Styled.Wrapper>
    );
  }
}
