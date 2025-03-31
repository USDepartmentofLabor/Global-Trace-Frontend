import { Vue, Component, Prop } from 'vue-property-decorator';
import { get, isEmpty } from 'lodash';
import { formatDate } from 'utils/date';
import { TransactionTypeEnum } from 'enums/app';
import * as Styled from './styled';

@Component
export default class Transaction extends Vue {
  @Prop({ required: true }) facility: Auth.Facility;
  @Prop({ default: [] })
  notLoggedTransactions: PDFPreview.NotLoggedTransaction[];
  @Prop({ default: [] }) transactions: PDFPreview.Transaction[];

  get saleTransactions(): PDFPreview.Transaction[] {
    return this.transactions.filter((trans: PDFPreview.Transaction) => {
      return trans.type === TransactionTypeEnum.SELL;
    });
  }

  get purchaseTransactions(): PDFPreview.Transaction[] {
    return this.transactions.filter(
      (trans: PDFPreview.Transaction) =>
        trans.type === TransactionTypeEnum.PURCHASE,
    );
  }

  get showNotLoggedTransactions(): boolean {
    return !isEmpty(this.notLoggedTransactions);
  }

  filterProducts(
    purchase: PDFPreview.Transaction,
  ): PDFPreview.TransactionItem[] {
    return get(purchase, 'transactionItems', []);
  }

  renderTitle(title: string): JSX.Element {
    return (
      <Styled.Row>
        <Styled.Title>{this.$t(title)}</Styled.Title>
      </Styled.Row>
    );
  }

  renderInfo(key: string, value: string | number = null): JSX.Element {
    return (
      <Styled.Info>
        <Styled.InfoItem>
          {key && <Styled.Span>{key}</Styled.Span>}
          {value && (
            <Styled.Text type="active">
              <text-direction>{value}</text-direction>
            </Styled.Text>
          )}
        </Styled.InfoItem>
      </Styled.Info>
    );
  }

  renderSale(): JSX.Element {
    return (
      <Styled.Sale>
        {!this.showNotLoggedTransactions && this.renderTitle('product_sale')}
        {this.saleTransactions.map((sale: PDFPreview.Transaction) => {
          const { toFacility, invoiceNumber, transactedAt } = sale;
          return (
            <fragment>
              <Styled.SellerInfo>
                {toFacility &&
                  this.renderInfo(this.$t('to'), get(toFacility, 'name'))}
                {invoiceNumber &&
                  this.renderInfo(
                    this.$t('invoice_number'),
                    get(sale, 'invoiceNumber', ''),
                  )}
                {this.renderInfo(
                  this.$t('invoice_date'),
                  formatDate(transactedAt),
                )}
              </Styled.SellerInfo>
            </fragment>
          );
        })}
      </Styled.Sale>
    );
  }

  renderPurchase(): JSX.Element {
    return (
      <fragment>
        {this.renderTitle('product_purchase')}
        {this.purchaseTransactions.map((purchase: PDFPreview.Transaction) => {
          const { fromFacility, fromFacilityType } = purchase;
          const facilityName = get(fromFacility, 'name');
          const roleName = get(fromFacilityType, 'name');
          const fromName = facilityName
            ? facilityName
            : this.$t('non_participating_role', {
                role: roleName,
              });
          return (
            <Styled.PurchaseInfo>
              {this.renderInfo(this.$t('from'), fromName)}
              {this.renderInfo(
                this.$t('purchase_order_number'),
                get(purchase, 'purchaseOrderNumber', 'purchaseOrderNumber'),
              )}
              {this.renderInfo(
                this.$t('purchase_date'),
                formatDate(get(purchase, 'transactedAt')),
              )}
            </Styled.PurchaseInfo>
          );
        })}
      </fragment>
    );
  }

  renderToFacilityName(name: string): JSX.Element {
    return (
      <Styled.Row contentTop>
        <Styled.Span bold>{this.$t('to')}:</Styled.Span>
        <Styled.Text type="active" bold>
          {name}
        </Styled.Text>
      </Styled.Row>
    );
  }

  renderNotLoggedTransactions(): JSX.Element {
    return (
      <fragment>
        {this.renderTitle('product_sale')}
        {this.notLoggedTransactions.map(
          (transaction: PDFPreview.NotLoggedTransaction) => {
            return (
              <Styled.PurchaseInfo>
                {this.renderToFacilityName(
                  get(transaction, 'toFacility.name', ''),
                )}
                <Styled.SellerInfo>
                  {this.renderInfo(
                    this.$t('sale_date'),
                    formatDate(transaction.transactedAt),
                  )}
                </Styled.SellerInfo>
              </Styled.PurchaseInfo>
            );
          },
        )}
      </fragment>
    );
  }

  renderContent(): JSX.Element {
    return (
      <fragment>
        {this.purchaseTransactions.length > 0 && this.renderPurchase()}
        {this.saleTransactions.length > 0 && this.renderSale()}
      </fragment>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Product>
        {this.showNotLoggedTransactions && this.renderNotLoggedTransactions()}
        {this.transactions && this.renderContent()}
      </Styled.Product>
    );
  }
}
