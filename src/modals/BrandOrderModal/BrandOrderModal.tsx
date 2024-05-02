import { Vue, Component, Prop } from 'vue-property-decorator';
import moment from 'moment';
import { isEmpty, isNull } from 'lodash';
import { convertDateToTimestamp, dateToISOString } from 'utils/date';
import { handleError } from 'components/Toast';
import { addOrder, editOrder } from 'api/brand-orders';
import auth from 'store/modules/auth';
import Button from 'components/FormUI/Button';
import SearchBox from './elements/SearchBox';
import Purchase from './elements/Purchase';
import Product from './elements/Product';
import Invoice from './elements/Invoice';
import * as Styled from './styled';

const ConfirmModal = () => import('modals/ConfirmModal');

@Component
export default class BrandOrderModal extends Vue {
  @Prop({ default: false }) hasResetModal: boolean;
  @Prop({ default: false }) isEditModal: boolean;
  @Prop({ default: true }) isShowDelete: boolean;
  @Prop({ default: null }) supplier: Auth.Facility;
  @Prop({ default: null }) order: BrandProduct.Order;
  @Prop({ required: true }) onSuccess: (orderId?: string) => void;
  @Prop({ required: false }) addSupplier: (isEditModal: boolean) => void;
  @Prop({ required: false }) changeOrder: (order: BrandProduct.Order) => void;
  @Prop({ required: false }) changeSupplier: (supplier: Auth.Facility) => void;
  @Prop({
    default: () => {
      //
    },
  })
  onDeleteOrder: () => void;

  private isLoading: boolean = false;
  private isSubmitting: boolean = false;
  private messageErrors: App.MessageError = null;
  private formName: string = 'brandOrderForm';
  private selectedSupplier: Auth.Facility = null;
  private formInput: BrandProduct.Order = {
    supplierId: null,
    purchaseOrderNumber: null,
    purchasedAt: null,
    productDescription: null,
    invoiceNumber: null,
    packingListNumber: null,
    quantity: null,
  };

  get isDisabled(): boolean {
    return (
      this.isSubmitting ||
      isNull(this.formInput.purchasedAt) ||
      isNull(this.formInput.supplierId)
    );
  }

  get title(): string {
    return this.isEditModal
      ? this.$t('brandOrderModal.edit')
      : this.$t('brandOrderModal.add');
  }

  get submitLabel(): string {
    return this.isEditModal
      ? this.$t('common.action.save_changes')
      : this.$t('add');
  }

  get formData(): BrandProduct.Order {
    return this.$formulate.registry.get(this.formName).proxy;
  }

  get purchasedAt(): Date {
    const { purchasedAt } = this.formData;
    return purchasedAt ? moment(purchasedAt).toDate() : null;
  }

  set purchasedAt(value: Date) {
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      purchasedAt: dateToISOString(value),
    });
  }

  created(): void {
    if (this.order) {
      this.selectedSupplier = this.order.supplier;
      this.formInput = {
        ...this.order,
        purchasedAt: this.order.purchasedAt && this.order.purchasedAt * 1000,
      };
    }
    if (this.supplier) {
      this.selectedSupplier = this.supplier;
      this.formInput.supplierId = this.supplier.id;
    }
  }

  disabledDate(date: Date): boolean {
    const validDate = moment().toDate();
    return date > validDate;
  }

  setSupplierId(supplier: Auth.Facility): void {
    this.formInput.supplierId = supplier.id;
    if (this.changeSupplier) {
      this.changeSupplier(supplier);
    }
  }

  changeSearch(): void {
    this.$formulate.resetValidation(this.formName);
  }

  onChangePackingListNumber(value: string): void {
    if (isEmpty(value)) {
      this.formInput.packingListNumber = null;
    } else {
      this.formInput.packingListNumber = value;
    }
    this.onClearMessageErrors();
  }

  onChangeInvoiceNumber(value: string): void {
    if (isEmpty(value)) {
      this.formInput.invoiceNumber = null;
    } else {
      this.formInput.invoiceNumber = value;
    }
    this.onClearMessageErrors();
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  onShowResetModal(): void {
    this.$modal.show(
      ConfirmModal,
      {
        icon: 'reload',
        iconSize: '76',
        message: this.$t('resetTraceModal.message'),
        note: this.$t('this_action_cannot_be_undone'),
        confirmLabel: this.$t('resetTraceModal.yes_reset'),
        confirmButtonVariant: 'danger',
        cancelLabel: this.$t('common.action.cancel'),
        onConfirm: this.onSubmit,
      },
      { width: '387px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  submitForm(): void {
    if (this.hasResetModal) {
      this.onShowResetModal();
    } else {
      this.onSubmit();
    }
  }

  async onSubmit(): Promise<void> {
    try {
      this.isSubmitting = true;
      const params = {
        supplierId: this.formInput.supplierId,
        invoiceNumber: this.formInput.invoiceNumber,
        packingListNumber: this.formInput.packingListNumber,
        productDescription: this.formInput.productDescription,
        purchaseOrderNumber: this.formInput.purchaseOrderNumber,
        quantity: this.formInput.quantity,
        purchasedAt: convertDateToTimestamp(this.purchasedAt),
      };
      if (this.isEditModal) {
        const { id } = this.order;
        await editOrder(id, params);
        this.$toast.success(this.$t('brandOrderModal.updated_success'));
        this.onSuccess();
      } else {
        const { id } = await addOrder(params);
        this.onSuccess(id);
      }
      this.closeModal();
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isSubmitting = false;
    }
  }

  onDelete(): void {
    this.onDeleteOrder && this.onDeleteOrder();
    this.closeModal();
  }

  onChangeDateTime(purchaseDate: string): void {
    this.purchasedAt = moment(purchaseDate).toDate();
  }

  onAddSupplier(): void {
    if (this.formInput.purchasedAt) {
      this.formInput.purchasedAt = convertDateToTimestamp(this.purchasedAt);
    }
    if (this.changeOrder) {
      this.changeOrder(this.formInput);
    }
    if (this.addSupplier) {
      this.addSupplier(this.isEditModal);
    }
    this.closeModal();
  }

  closeModal(): void {
    this.$emit('close');
  }

  renderSupplierInput(): JSX.Element {
    return (
      <Styled.Col>
        <SearchBox
          selectedSupplier={this.selectedSupplier}
          changeSearch={this.changeSearch}
          setSupplier={this.setSupplierId}
        />
        {auth.isBrand && (
          <Styled.AddSupplierText onClick={this.onAddSupplier}>
            {this.$t('add_new_supplier')}
          </Styled.AddSupplierText>
        )}
      </Styled.Col>
    );
  }

  renderPurchase(): JSX.Element {
    return (
      <Purchase
        purchasedAt={this.purchasedAt}
        isSubmitting={this.isSubmitting}
        clearMessageErrors={this.onClearMessageErrors}
        changeDateTime={this.onChangeDateTime}
      />
    );
  }

  renderProduct(): JSX.Element {
    return (
      <Product
        isSubmitting={this.isSubmitting}
        clearMessageErrors={this.onClearMessageErrors}
      />
    );
  }

  renderInvoice(): JSX.Element {
    return (
      <Invoice
        isSubmitting={this.isSubmitting}
        changeInvoiceNumber={this.onChangeInvoiceNumber}
        changePackingListNumber={this.onChangePackingListNumber}
      />
    );
  }

  renderActions(hasError: boolean): JSX.Element {
    return (
      <Styled.Actions>
        <Button
          type="submit"
          variant="primary"
          label={this.submitLabel}
          isLoading={this.isLoading}
          disabled={this.isDisabled || hasError}
          width="326px"
        />
        {this.isEditModal && this.isShowDelete && (
          <Button
            label={this.$t('common.action.delete')}
            variant="outlinePrimary"
            width="326px"
            isLoading={this.isLoading}
            click={this.onDelete}
          />
        )}
        <Button
          label={this.$t('common.action.cancel')}
          variant="transparentPrimary"
          width="326px"
          click={this.closeModal}
        />
      </Styled.Actions>
    );
  }

  renderForm(): JSX.Element {
    return (
      <formulate-form
        v-model={this.formInput}
        name={this.formName}
        scopedSlots={{
          default: ({ hasErrors }: { hasErrors: boolean }) => (
            <Styled.Form>
              {this.renderSupplierInput()}
              {this.renderPurchase()}
              {this.renderProduct()}
              {this.renderInvoice()}
              {this.renderActions(hasErrors)}
            </Styled.Form>
          ),
        }}
        vOn:submit={this.submitForm}
      />
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout title={this.title} closeModal={this.closeModal}>
        <Styled.Wrapper>{this.renderForm()}</Styled.Wrapper>
      </modal-layout>
    );
  }
}
