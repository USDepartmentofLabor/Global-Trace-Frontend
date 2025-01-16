/* eslint-disable max-lines */
import { Vue, Component, Prop } from 'vue-property-decorator';
import { get } from 'lodash';
import { formatNumber } from 'utils/helpers';
import { formatDate } from 'utils/date';
import { TransactionTypeEnum } from 'enums/app';
import { getShortToken } from 'api/auth';
import { downloadDocumentAssociatedUrl } from 'utils/download-helper';
import { getTransactionLevel } from 'utils/product-attributes';
import { convertEnumToTranslation, getCategoryName } from 'utils/translation';
import { handleError } from 'components/Toast';
import * as Styled from './styled';

@Component
export default class Transaction extends Vue {
  @Prop({ required: true }) history: TransactionHistory.History;
  private isExpand: boolean = false;

  toggleExpand(): void {
    this.isExpand = !this.isExpand;
  }

  async downloadDocument(): Promise<void> {
    try {
      const transactionId = this.getTransactionId();
      const { shortToken } = await getShortToken();
      const downloadUrl = downloadDocumentAssociatedUrl(
        transactionId,
        this.history.type,
        shortToken,
      );
      window.open(downloadUrl, '_blank');
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  getTransactionId(): string {
    switch (this.history.type) {
      case TransactionTypeEnum.PURCHASE:
      case TransactionTypeEnum.SELL:
      case TransactionTypeEnum.TRANSPORT:
        return this.history.transaction.id;
      case TransactionTypeEnum.RECORD_PRODUCT:
        return this.history.recordProduct.id;
      default:
        return '';
    }
  }

  getName(): string {
    let name = '';
    switch (this.history.type) {
      case TransactionTypeEnum.PURCHASE:
        name = get(this.history, 'transaction.fromFacility.name', '');
        break;
      case TransactionTypeEnum.SELL:
      case TransactionTypeEnum.TRANSPORT:
        name = get(this.history, 'transaction.toFacility.name', '');
        break;
      default:
        name = '';
    }
    return name;
  }

  getHistoryType(type: TransactionTypeEnum): {
    [key: string]: string;
  } {
    switch (type) {
      case TransactionTypeEnum.PURCHASE:
        return { name: this.$t('purchase'), icon: 'shopping' };
      case TransactionTypeEnum.SELL:
        return { name: this.$t('sale'), icon: 'tag' };
      case TransactionTypeEnum.TRANSFORM:
        return { name: this.$t('product_id'), icon: 'bar_code' };
      case TransactionTypeEnum.RECORD_PRODUCT:
        return { name: this.$t('by_product'), icon: 'document' };
      case TransactionTypeEnum.TRANSPORT:
        return { name: this.$t('transport'), icon: 'transport' };
      default:
        return { name: '', icon: '' };
    }
  }

  getHistoryDate(): string {
    if (this.history.type === TransactionTypeEnum.RECORD_PRODUCT) {
      return formatDate(this.history.recordedAt);
    }
    const transactedAt = get(this.history, 'transaction.transactedAt');
    const date = transactedAt ? transactedAt : this.history.createdAt;
    return formatDate(date);
  }

  getQrCode(product: Purchase.Product): string {
    return get(product, 'qrCode.code', product.code);
  }

  getProductInfo(quantity: number, unit: string): string {
    return `${formatNumber(quantity)} ${unit}`;
  }

  getDNA(transactionItem: TransactionHistory.TransactionItem) {
    const { product } = transactionItem;
    switch (this.history.type) {
      case TransactionTypeEnum.PURCHASE:
        return product.dnaIdentifier;
      case TransactionTypeEnum.TRANSFORM:
      case TransactionTypeEnum.SELL:
      case TransactionTypeEnum.TRANSPORT:
        return product.dnaIdentifier;
      default:
        return null;
    }
  }

  renderTransactionType(): JSX.Element {
    const { icon, name } = this.getHistoryType(this.history.type);
    return (
      <Styled.TransactionType>
        <font-icon name={icon} size="14" color="stormGray" />
        <Styled.Text>{name}</Styled.Text>
      </Styled.TransactionType>
    );
  }

  renderTransformItem(
    transactionItem: TransactionHistory.TransactionItem,
  ): JSX.Element {
    const { product } = transactionItem;
    return (
      <Styled.Transaction>
        <Styled.TransactionDetail>
          {this.getQrCode(product)}
        </Styled.TransactionDetail>
        <Styled.TransactionDetail>
          {get(product, 'dnaIdentifier', '')}
        </Styled.TransactionDetail>
        <Styled.TransactionDetail>
          <text-direction>
            {this.getProductInfo(product.quantity, product.quantityUnit)}
          </text-direction>
        </Styled.TransactionDetail>
        {product.productDefinition && (
          <Styled.TransactionDetail isProductName>
            {`(${getCategoryName(
              product.productDefinition.name,
              product.productDefinition.nameTranslation,
            )})`}
          </Styled.TransactionDetail>
        )}
      </Styled.Transaction>
    );
  }

  renderTransformItems(): JSX.Element {
    const transformationItems = get(
      this.history,
      'transformation.transformationItems',
      [],
    );
    return (
      <Styled.Col isMultiple>
        {transformationItems.map((item: TransactionHistory.TransactionItem) =>
          this.renderTransformItem(item),
        )}
      </Styled.Col>
    );
  }

  renderWeight(weight: number, unit: string): JSX.Element {
    return (
      <Styled.TransactionDetail>{`${formatNumber(weight)} ${this.$t(
        convertEnumToTranslation(unit),
      )}`}</Styled.TransactionDetail>
    );
  }

  renderPurchaseItem(
    transactionItem: TransactionHistory.TransactionItem,
  ): JSX.Element {
    const { product } = transactionItem;
    return (
      <Styled.Transaction>
        <Styled.TransactionDetail>
          {this.getQrCode(product)}
        </Styled.TransactionDetail>
        <Styled.TransactionDetail>
          <text-direction>
            {this.getProductInfo(product.quantity, product.quantityUnit)}
          </text-direction>
        </Styled.TransactionDetail>
      </Styled.Transaction>
    );
  }

  renderTransactionItems(): JSX.Element {
    const transactionItems = get(
      this.history,
      'transaction.transactionItems',
      [],
    );
    return (
      <Styled.Col isMultiple>
        {transactionItems.map((item: TransactionHistory.TransactionItem) =>
          this.renderPurchaseItem(item),
        )}
      </Styled.Col>
    );
  }

  renderTransactionDetail(): JSX.Element {
    switch (this.history.type) {
      case TransactionTypeEnum.PURCHASE:
      case TransactionTypeEnum.TRANSPORT:
      case TransactionTypeEnum.SELL:
        return this.renderTransactionItems();
      case TransactionTypeEnum.TRANSFORM:
        return this.renderTransformItems();
      case TransactionTypeEnum.RECORD_PRODUCT:
        return this.renderWeight(
          this.history.recordProduct.totalWeight,
          this.history.recordProduct.weightUnit,
        );
      default:
        return null;
    }
  }

  renderTransactionLevel(): JSX.Element {
    if (this.history.type === TransactionTypeEnum.PURCHASE) {
      const transactionItems: TransactionHistory.TransactionItem[] = get(
        this.history,
        'transaction.transactionItems',
        [],
      );

      return (
        <Styled.Col>
          {transactionItems.map(({ product }) => {
            const content = getTransactionLevel(
              get(product, 'additionalAttributes', []),
            );
            if (content) {
              return (
                <Styled.Bordered>
                  <Styled.TransactionDetail>
                    <text-direction>{content}</text-direction>
                  </Styled.TransactionDetail>
                </Styled.Bordered>
              );
            }
          })}
        </Styled.Col>
      );
    }

    return null;
  }

  renderVerified(): JSX.Element {
    if (this.history.type === TransactionTypeEnum.PURCHASE) {
      const transactionItems: TransactionHistory.TransactionItem[] = get(
        this.history,
        'transaction.transactionItems',
        [],
      );
      return (
        <Styled.Col>
          {transactionItems.map(({ product }) => {
            const verified = Math.round(parseFloat(product.verifiedPercentage));
            return (
              <Styled.Bordered>
                <Styled.TransactionDetail>
                  <text-direction>
                    {`${verified}% ${this.$t('verified')}`}
                  </text-direction>
                </Styled.TransactionDetail>
              </Styled.Bordered>
            );
          })}
        </Styled.Col>
      );
    }
    return <Styled.Bordered isEmpty />;
  }

  renderFacilityName(): JSX.Element {
    const name = this.getName();
    if (
      this.history.type === TransactionTypeEnum.PURCHASE ||
      this.history.type === TransactionTypeEnum.SELL
    ) {
      const transactionItems: TransactionHistory.TransactionItem[] = get(
        this.history,
        'transaction.transactionItems',
        [],
      );
      return (
        <Styled.Col>
          {transactionItems.map((_item) => (
            <Styled.Bordered>
              <Styled.TransactionDetail>{name}</Styled.TransactionDetail>
            </Styled.Bordered>
          ))}
        </Styled.Col>
      );
    }
    if (this.history.type === TransactionTypeEnum.TRANSPORT) {
      return (
        <Styled.Bordered>
          <Styled.TransactionDetail>{name}</Styled.TransactionDetail>
        </Styled.Bordered>
      );
    }
    return <Styled.Bordered isEmpty />;
  }

  renderIcon(): JSX.Element {
    if (this.history.type === TransactionTypeEnum.TRANSFORM) {
      return null;
    }
    return (
      <font-icon
        vOn:click_native={() => this.downloadDocument()}
        name="attach_file"
        color="envy"
        size="24"
        cursor
      />
    );
  }

  renderMobileTransaction(): JSX.Element {
    return (
      <Styled.Card>
        <Styled.CardHeader onClick={this.toggleExpand}>
          <Styled.CardHeaderLeft>
            {this.renderIcon()}
            {this.getHistoryDate()}
          </Styled.CardHeaderLeft>
          <Styled.CardHeaderRight>
            {this.renderTransactionType()}
            <Styled.IconExpand isExpand={this.isExpand}>
              <font-icon name="expand_more" color="envy" size="24" cursor />
            </Styled.IconExpand>
          </Styled.CardHeaderRight>
        </Styled.CardHeader>
        {this.isExpand && (
          <Styled.CardContent>
            <Styled.TransactionContent>
              {this.renderTransactionDetail()}
              {this.renderTransactionLevel()}
              {this.renderVerified()}
            </Styled.TransactionContent>
            <Styled.FacilityName>
              {this.renderFacilityName()}
            </Styled.FacilityName>
          </Styled.CardContent>
        )}
      </Styled.Card>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Tr>
        <Styled.Td>{this.renderIcon()}</Styled.Td>
        <Styled.Td>{this.getHistoryDate()}</Styled.Td>
        <Styled.Td>{this.renderTransactionType()}</Styled.Td>
        <Styled.Td>{this.renderTransactionDetail()}</Styled.Td>
        <Styled.Td>{this.renderTransactionLevel()}</Styled.Td>
        <Styled.Td>{this.renderVerified()}</Styled.Td>
        <Styled.Td>{this.renderFacilityName()}</Styled.Td>
        {this.renderMobileTransaction()}
      </Styled.Tr>
    );
  }
}
