/* eslint-disable max-lines */
import { Vue, Component, Prop } from 'vue-property-decorator';
import { get, isEmpty, isNull } from 'lodash';
import moment from 'moment';
import { convertDateToTimestamp, dateToISOString } from 'utils/date';
import { handleError } from 'components/Toast';
import {
  getOrderSupplier,
  removeOrderSupplier,
  selectOrderSupplier,
  updateOrderSupplier,
} from 'api/order-supplier';
import { SpinLoading } from 'components/Loaders';
import Button from 'components/FormUI/Button';
import Purchase from './elements/Purchase';
import Invoice from './elements/Invoice';
import * as Styled from './styled';
import SearchBox from './elements/SearchBox';

const ConfirmModal = () => import('modals/ConfirmModal');

@Component
export default class OrderSupplierModal extends Vue {
  @Prop({ default: false }) readonly isEdit: boolean;
  @Prop({ default: null }) readonly supplier: BrandSupplier.SupplierItem;
  @Prop({
    default: () => {
      //
    },
  })
  onDeleteOrderSupplier: () => void;
  @Prop({
    default: () => {
      //
    },
  })
  onSuccess: () => void;

  private isLoading: boolean = false;
  private formName: string = 'orderSupplierForm';
  private isSubmitting: boolean = false;
  private messageErrors: App.MessageError = null;
  private selectedSupplier: Auth.Facility = null;
  private fromSupplierId: string = '';
  private selectedOrderSupplier: BrandTrace.OrderSupplier = null;
  private formInput: BrandTrace.OrderSupplierRequestParams = {
    supplierId: '',
    parentId: '',
    purchasedAt: null,
    purchaseOrderNumber: '',
    invoiceNumber: '',
    packingListNumber: '',
  };

  get orderId(): string {
    return get(this.$route, 'params.id');
  }

  get isDisabled(): boolean {
    return (
      this.isSubmitting ||
      isNull(this.formInput.purchasedAt) ||
      isEmpty(this.formInput.supplierId)
    );
  }

  get modalTitle(): string {
    if (this.isEdit) {
      return this.$t('edit_supplier');
    }
    return this.$t('add_another_supplier');
  }

  get submitLabel(): string {
    if (this.isEdit) {
      return this.$t('common.action.save_changes');
    }
    return this.$t('common.action.select');
  }

  get formData(): BrandTrace.OrderSupplierRequestParams {
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
    if (this.isEdit) {
      this.initEditData();
    } else {
      this.initAddData();
    }
  }

  async initEditData(): Promise<void> {
    try {
      this.isLoading = true;
      this.selectedSupplier = this.supplier;
      await this.getSelectedOrderSupplier(
        this.orderId,
        this.supplier.orderSupplierId,
      );
      const {
        id,
        supplierId,
        invoiceNumber,
        packingListNumber,
        purchaseOrderNumber,
        purchasedAt,
      } = this.selectedOrderSupplier;
      this.fromSupplierId = this.supplier.id;
      this.formInput.supplierId = supplierId;
      this.formInput.invoiceNumber = invoiceNumber;
      this.formInput.packingListNumber = packingListNumber;
      this.formInput.purchaseOrderNumber = purchaseOrderNumber;
      this.formInput.purchasedAt = purchasedAt * 1000;
      this.formInput.parentId = id;
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  initAddData(): void {
    this.formInput.parentId = this.supplier.orderSupplierId;
    this.fromSupplierId = this.supplier.id;
  }

  async getSelectedOrderSupplier(orderId: string, orderSupplierId: string) {
    try {
      this.selectedOrderSupplier = await getOrderSupplier(
        orderId,
        orderSupplierId,
      );
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  async onSubmit(): Promise<void> {
    try {
      this.isSubmitting = true;
      const payload = {
        ...this.formData,
        purchasedAt: convertDateToTimestamp(this.purchasedAt),
        orderId: this.orderId,
      };

      if (this.isEdit) {
        payload.orderSupplierId = get(this.selectedOrderSupplier, 'id');
        await updateOrderSupplier(payload);
        this.$toast.success(this.$t('orderSupplierModal.updated_success'));
      } else {
        await selectOrderSupplier(payload);
      }
    } catch (error) {
      handleError(error as App.ResponseError);
      this.messageErrors = get(error, 'errors');
    } finally {
      this.isSubmitting = false;
      this.closeModal();
      this.onSuccess();
    }
  }

  setSupplierId(supplierId: string): void {
    this.formInput.supplierId = supplierId;
  }

  changeSearch(): void {
    this.$formulate.resetValidation(this.formName);
  }

  closeModal(): void {
    this.$emit('close');
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  onChangeDateTime(purchaseDate: string): void {
    this.purchasedAt = moment(purchaseDate).toDate();
  }

  async deleteOrderSupplier(): Promise<void> {
    try {
      const orderSupplierId = get(this.selectedOrderSupplier, 'id');
      await removeOrderSupplier(this.orderId, orderSupplierId);
      this.$toast.success(this.$t('orderSupplierModal.removed_success'));
    } catch (error) {
      handleError(error as App.ResponseError);
      this.messageErrors = get(error, 'errors');
    } finally {
      this.closeModal();
      this.onSuccess();
    }
  }

  showConfirmDeleteModal(): void {
    this.$modal.show(
      ConfirmModal,
      {
        icon: 'delete_forever',
        iconSize: '44',
        message: this.$t('orderSupplierModal.remove_message'),
        messagePosition: 'center',
        note: this.$t('this_action_cannot_be_undone'),
        confirmLabel: this.$t('common.action.yes_delete'),
        confirmButtonVariant: 'danger',
        cancelLabel: this.$t('common.action.cancel'),
        onConfirm: () => this.deleteOrderSupplier(),
      },
      { width: '351px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  renderActions(hasError: boolean): JSX.Element {
    return (
      <Styled.Actions isColumn={!this.isEdit}>
        <Button
          type="submit"
          variant="primary"
          label={this.submitLabel}
          disabled={this.isDisabled || hasError}
          width="230px"
        />
        {this.isEdit && (
          <Button
            label={this.$t('orderSupplierModal.remove_this_supplier')}
            variant="transparentPrimary"
            width="230px"
            click={this.showConfirmDeleteModal}
          />
        )}
        {!this.isEdit && (
          <Button
            label={this.$t('common.action.cancel')}
            variant="transparentPrimary"
            width="230px"
            click={this.closeModal}
            disabled={this.isSubmitting}
          />
        )}
      </Styled.Actions>
    );
  }

  renderSupplierInput(): JSX.Element {
    return (
      <Styled.Col>
        <SearchBox
          isEdit={this.isEdit}
          selectedSupplier={this.selectedSupplier}
          parentId={this.formInput.parentId}
          fromSupplierId={this.fromSupplierId}
          changeSearch={this.changeSearch}
          setSupplier={this.setSupplierId}
        />
      </Styled.Col>
    );
  }

  renderSuggestionBox(): JSX.Element {
    return (
      <Styled.Box>
        {this.$t('orderSupplierModal.text_box_above')}
        <Styled.Strong>
          {this.$t('orderSupplierModal.text_box_under')}
        </Styled.Strong>
      </Styled.Box>
    );
  }

  renderPurchase(): JSX.Element {
    return (
      <Purchase
        purchasedAt={this.purchasedAt}
        isSubmitting={this.isSubmitting}
        changeInput={this.onClearMessageErrors}
        changeDateTime={this.onChangeDateTime}
      />
    );
  }

  renderInvoice(): JSX.Element {
    return (
      <Invoice
        isSubmitting={this.isSubmitting}
        invoiceNumber={this.formData.invoiceNumber}
        changeInput={this.onClearMessageErrors}
      />
    );
  }

  renderForm(hasErrors: boolean): JSX.Element {
    return (
      <fragment>
        {!this.isEdit && this.renderSupplierInput()}
        {this.renderSuggestionBox()}
        {this.renderPurchase()}
        {this.renderInvoice()}
        {this.renderActions(hasErrors)}
      </fragment>
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout
        showCloseIcon={this.isEdit}
        title={this.modalTitle}
        closeModal={this.closeModal}
      >
        <Styled.Content>
          <formulate-form
            v-model={this.formInput}
            name={this.formName}
            vOn:submit={this.onSubmit}
            scopedSlots={{
              default: ({ hasErrors }: { hasErrors: boolean }) => (
                <fragment>
                  {this.isLoading && <SpinLoading isInline={false} />}
                  {!this.isLoading && this.renderForm(hasErrors)}
                </fragment>
              ),
            }}
          />
        </Styled.Content>
      </modal-layout>
    );
  }
}
