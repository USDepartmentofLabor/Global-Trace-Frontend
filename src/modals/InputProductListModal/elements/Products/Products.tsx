import { Vue, Component, Prop } from 'vue-property-decorator';
import { find, get, orderBy } from 'lodash';
import { getShortToken } from 'api/auth';
import { SortType } from 'enums/app';
import { formatDate } from 'utils/date';
import { InputAttributeEnum } from 'enums/app';
import { downloadProductAttachmentsUrl } from 'utils/download-helper';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import * as Styled from './styled';

@Component
export default class Products extends Vue {
  @Prop({ default: [] }) readonly defaultProducts: AssignProduct.Product[];

  private products: AssignProduct.Product[] = [];
  private isLoading: boolean = false;
  private filters: AssignProduct.ProductLotFilterParams = {
    code: SortType.DESC,
    createdAt: SortType.DESC,
  };

  created(): void {
    this.products = this.defaultProducts;
  }

  removeProduct(index: number): void {
    this.products.splice(index, 1);
  }

  changeSortFilter(key: string): void {
    this.filters[key] =
      this.filters[key] === SortType.ASC ? SortType.DESC : SortType.ASC;
    const productsOrder = orderBy(this.products, [key], [this.filters[key]]);
    this.products = productsOrder;
  }

  renderFilter(): JSX.Element {
    return (
      <Styled.FilterContainer>
        <Styled.FilterWrapper
          sortType={this.filters.createdAt}
          vOn:click={() => this.changeSortFilter('createdAt')}
        >
          {this.$t('added_date')}
          <font-icon name="arrow_dropdown" size="24" />
        </Styled.FilterWrapper>
        <Styled.FilterWrapper
          sortType={this.filters.code}
          vOn:click={() => this.changeSortFilter('code')}
        >
          {this.$t('product_id')}
          <font-icon name="arrow_dropdown" size="24" />
        </Styled.FilterWrapper>
        <Styled.FilterWrapper>
          {this.$t('file_and_attachment')}
        </Styled.FilterWrapper>
        <Styled.FilterAction />
      </Styled.FilterContainer>
    );
  }

  hasAttachments(product: AssignProduct.Product): boolean {
    const { additionalAttributes } = product;
    const fileAttribute = find(
      additionalAttributes,
      (attribute: Purchase.ManualAddedAttribute) =>
        attribute.category === InputAttributeEnum.ATTACHMENTS ||
        get(attribute, 'attribute.category') === InputAttributeEnum.ATTACHMENTS,
    );
    return fileAttribute && !!fileAttribute.value;
  }

  async downloadProductAttachments(id: string): Promise<void> {
    try {
      this.isLoading = true;
      const response = await getShortToken();
      const downloadUrl = downloadProductAttachmentsUrl(
        id,
        response.shortToken,
      );
      window.open(downloadUrl, '_blank');
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  renderProduct(product: AssignProduct.Product, index: number): JSX.Element {
    const code = get(product, 'code');
    return (
      <Styled.ProductDetail>
        <Styled.Time>{formatDate(product.createdAt)}</Styled.Time>
        <Styled.Code>{get(product, 'qrCode.code', code)}</Styled.Code>
        {this.hasAttachments(product) && (
          <Styled.DownloadAttachments
            onClick={() => this.downloadProductAttachments(product.id)}
          >
            <font-icon name="download" color="envy" size="20" />
            <Styled.DownloadText>{this.$t('download')}</Styled.DownloadText>
          </Styled.DownloadAttachments>
        )}
        {!this.hasAttachments(product) && <Styled.EmptyAttachments />}
        <font-icon
          class="remove-product"
          name="remove"
          size="24"
          color="ghost"
          vOn:click_native={() => this.removeProduct(index)}
        />
      </Styled.ProductDetail>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Container>
        {this.renderFilter()}
        <perfect-scrollbar>
          {this.products.map((product, index) =>
            this.renderProduct(product, index),
          )}
        </perfect-scrollbar>
        {this.isLoading && <SpinLoading isInline={false} />}
      </Styled.Container>
    );
  }
}
