import { Vue, Component, Prop } from 'vue-property-decorator';
import { filter, find, flatMap, get, isEmpty, isUndefined } from 'lodash';
import { downloadMultipleFiles } from 'utils/helpers';
import { formatDate, currentTimestamp } from 'utils/date';
import { ProductAttributeTypeEnum } from 'enums/product';
import { InputAttributeEnum } from 'enums/app';
import { SpinLoading } from 'components/Loaders';
import * as Styled from './styled';

@Component
export default class Product extends Vue {
  @Prop({ default: null, required: true })
  product: AssignProduct.OutputProductData;
  @Prop() removeProduct: (addedTime: number) => void;

  private isLoading = false;

  get addedTime(): number {
    return get(this.product, 'addedTime', currentTimestamp());
  }

  get productID(): string {
    const attributeId = find(
      this.product.attributes,
      (attr: Purchase.ManualAddedAttribute) =>
        attr.type === ProductAttributeTypeEnum.PRODUCT_ID,
    );
    if (attributeId) {
      return get(attributeId, 'value', '');
    }
    return get(this.product, 'qrCode', '') as string;
  }

  get hasAttachments(): boolean {
    const { attributes } = this.product;
    return attributes.some(
      (attribute) => !isEmpty(get(attribute, 'value', [])),
    );
  }

  downloadAttachmentFromManually() {
    const attachmentAttributes = this.product.attributes.filter(
      (attribute) =>
        get(attribute, 'category') === InputAttributeEnum.ATTACHMENTS,
    );
    const files = filter(
      flatMap(attachmentAttributes, 'value'),
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
        <Styled.ProductItem>
          <Styled.Time>{formatDate(this.addedTime)}</Styled.Time>
          <Styled.Code>{this.productID}</Styled.Code>
          {this.hasAttachments ? (
            <Styled.DownloadAttachments
              onClick={this.downloadAttachmentFromManually}
            >
              <font-icon name="download" color="envy" size="20" />
              <Styled.DownloadText>{this.$t('download')}</Styled.DownloadText>
            </Styled.DownloadAttachments>
          ) : (
            <Styled.EmptyAttachments />
          )}
          <Styled.RemoveProduct>
            <font-icon
              name="remove"
              size="14"
              color="ghost"
              vOn:click_native={() => this.removeProduct(this.addedTime)}
            />
          </Styled.RemoveProduct>
        </Styled.ProductItem>
        {this.isLoading && <SpinLoading isInline={false} />}
      </Styled.Wrapper>
    );
  }
}
