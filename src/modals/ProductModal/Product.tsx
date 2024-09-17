import { Vue, Component, Prop } from 'vue-property-decorator';
import { find, get } from 'lodash';
import { getShortToken } from 'api/auth';
import { formatDate } from 'utils/date';
import { InputAttributeEnum } from 'enums/app';
import { downloadProductAttachmentsUrl } from 'utils/download-helper';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import * as Styled from './styled';

@Component
export default class Product extends Vue {
  @Prop({ default: [] }) readonly product: ProductManagement.Product;
  @Prop({ required: true }) readonly index: number;
  @Prop({
    default: () => {
      //
    },
  })
  removeProduct: (index: number) => void;

  private isLoading: boolean = false;

  get addedTime(): string {
    return formatDate(get(this.product, 'createdAt', 0));
  }

  get productID(): string {
    if (this.product.qrCode) {
      return get(this.product, 'qrCode.code', '');
    }
    return get(this.product, 'code', '');
  }

  get hasAttachments(): boolean {
    const fileAttribute = find(
      this.product.additionalAttributes,
      (attribute: ProductManagement.ProductAttributeParams) =>
        attribute.category === InputAttributeEnum.ATTACHMENTS ||
        get(attribute, 'attribute.category') === InputAttributeEnum.ATTACHMENTS,
    );
    return fileAttribute && !!fileAttribute.value;
  }

  async downloadProductAttachments(): Promise<void> {
    try {
      this.isLoading = true;
      const response = await getShortToken();
      const downloadUrl = downloadProductAttachmentsUrl(
        this.product.id,
        response.shortToken,
      );
      window.open(downloadUrl, '_blank');
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  render(): JSX.Element {
    return (
      <Styled.Product>
        <Styled.Time>{this.addedTime}</Styled.Time>
        <Styled.Code>{this.productID}</Styled.Code>
        {this.hasAttachments && (
          <Styled.DownloadAttachments
            onClick={() => this.downloadProductAttachments()}
          >
            <font-icon name="download" color="envy" size="20" />
            <Styled.DownloadText>{this.$t('download')}</Styled.DownloadText>
          </Styled.DownloadAttachments>
        )}
        {!this.hasAttachments && <Styled.EmptyAttachments />}
        <font-icon
          class="remove-product"
          name="remove"
          size="24"
          color="ghost"
          vOn:click_native={() => this.removeProduct(this.index)}
        />
        {this.isLoading && <SpinLoading isInline={false} />}
      </Styled.Product>
    );
  }
}
