/* eslint-disable max-lines */
import { Vue, Component } from 'vue-property-decorator';
import moment from 'moment';
import { some, isEmpty, omit, get, find, isNull } from 'lodash';
import purchaseModule from 'store/modules/purchase';
import { dateToISOString, convertDateToTimestamp } from 'utils/date';
import { getUploadFileObjectParams } from 'utils/helpers';
import { DATE_TIME_FORMAT } from 'config/constants';
import { createPurchaseProduct } from 'api/purchase';
import { handleError } from 'components/Toast';
import Button from 'components/FormUI/Button';
import DatePicker from 'components/FormUI/DatePicker';
import Dropdown from 'components/FormUI/Dropdown';
import FileUpload from 'components/FormUI/FileUpload';
import InputPrice from 'components/FormUI/Input/InputPrice';
import Input from 'components/FormUI/Input';
import { SpinLoading } from 'components/Loaders';
import MessageError from 'components/FormUI/MessageError';
import Product from './elements/Product';
import * as Styled from './styled';

@Component
export default class PurchaseContainer extends Vue {
  private isSubmitting: boolean = false;
  private formInput: Purchase.PurchaseRequestParams = {
    fromFacilityId: '',
    price: null,
    currency: '',
    purchaseOrderNumber: '',
    transactedAt: null,
    uploadProofs: [],
    manualAddedData: null,
  };
  private isLoading: boolean = false;
  private sellerSelected: App.DropdownOption = null;
  private messageErrors: App.MessageError = null;
  private participatingName: string = null;
  private formName: string = 'purchaseForm';
  private products: Purchase.Product[] = [];
  private hasErrorUpload: boolean = false;

  get formData(): Purchase.PurchaseRequestParams {
    return this.$formulate.registry.get(this.formName).proxy;
  }

  get transactedAt(): Date {
    const { transactedAt } = this.formData;
    return transactedAt ? moment(transactedAt).toDate() : null;
  }

  set transactedAt(value: Date) {
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      transactedAt: dateToISOString(value),
    });
  }

  get sellerOptions(): App.DropdownOption[] {
    if (!purchaseModule.isSellerRequired) {
      const defaultSeller: App.DropdownOption = {
        id: null,
        name: this.$t('non_participating_role', {
          role: this.participatingName,
        }),
      };
      return [defaultSeller, ...purchaseModule.partnerSellers];
    }
    return purchaseModule.partnerSellers;
  }

  get productDefinitionId(): string {
    const manualAddedData = find(
      this.products,
      (product: Purchase.Product) => product.isManualAdded,
    );
    return get(manualAddedData, 'code', '');
  }

  get isDisabledSubmit(): boolean {
    const { transactedAt, uploadProofs } = this.formInput;
    return (
      this.isSubmitting ||
      isNull(this.sellerSelected) ||
      isEmpty(transactedAt) ||
      isEmpty(uploadProofs) ||
      this.hasErrorUpload
    );
  }

  created(): void {
    this.initial();
  }

  async initial(): Promise<void> {
    this.isLoading = true;
    await this.getRequiredSellers();
    await this.initPartnerSellers();
    this.isLoading = false;
  }

  async getRequiredSellers(): Promise<void> {
    await purchaseModule.getRequiredSellers({
      callback: {
        onSuccess: (response: Purchase.RequiredSellers) => {
          this.participatingName = get(response, 'nonParticipatingRoleName');
        },
        onFailure: (error: App.ResponseError) => {
          handleError(error);
        },
      },
    });
  }

  async initPartnerSellers(): Promise<void> {
    await purchaseModule.getPartnerSellers({
      params: {},
      callback: {
        onFailure: (error: App.ResponseError) => {
          handleError(error);
        },
      },
    });
  }

  searchPartnerSellers(searchText: string): void {
    const payload: Purchase.PartnerSellerParam = {
      key: searchText,
    };
    purchaseModule.getPartnerSellers({
      params: payload,
      callback: {
        onFailure: (error: App.ResponseError) => {
          handleError(error);
        },
      },
    });
  }

  getCottonAttributes(product: Purchase.Product): Purchase.CottonAttributes {
    return {
      cottonCertification: product.cottonCertification,
      moistureLevel: product.moistureLevel,
      trashContent: product.trashContent,
      grade: product.grade,
    };
  }

  async getPurchaseRequestParams(): Promise<Purchase.PurchaseRequestParams> {
    this.formData.productIds = this.products
      .filter((product) => !isEmpty(product.id))
      .map((product) => product.id);
    let payloads = {
      ...this.formData,
      transactedAt: convertDateToTimestamp(this.transactedAt),
      uploadProofs: await getUploadFileObjectParams(
        this.formData.uploadProofs as File[],
      ),
    };
    if (this.productDefinitionId) {
      payloads.manualAddedData = {
        productDefinitionId: this.productDefinitionId,
        manualAddedProducts: this.products.filter((product) =>
          isEmpty(product.id),
        ),
      };
    }
    if (isEmpty(this.formData.price)) {
      payloads = omit(payloads, ['currency', 'price']);
    }
    return payloads;
  }

  async onSubmit(): Promise<void> {
    this.isSubmitting = true;
    const payloads = await this.getPurchaseRequestParams();
    try {
      await createPurchaseProduct(payloads);
      this.$router.push({ name: 'Homepage' });
      this.$toast.success(this.$t('data_saved'));
    } catch (error) {
      handleError(error as App.ResponseError);
      this.messageErrors = get(error, 'errors');
    } finally {
      this.isSubmitting = false;
    }
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  onChangeSeller(option: App.DropdownOption): void {
    this.sellerSelected = option;
    this.formInput.fromFacilityId = option ? (option.id as string) : null;
  }

  onChangeCurrency(currency: string): void {
    this.formInput.currency = currency;
    this.onClearMessageErrors();
  }

  onChangeDateTime(transactedAt: string): void {
    this.transactedAt = moment(transactedAt).toDate();
  }

  onChangeFiles(selectedFiles: App.SelectedFile[]): void {
    this.hasErrorUpload = some(selectedFiles, ['isError', true]);
    this.formInput.uploadProofs = selectedFiles.map(({ file }) => file);
  }

  onChangeLots(products: Purchase.Product[]): void {
    this.products = products;
    this.initPartnerSellers();
  }

  disabledDatetime(date: Date): boolean {
    const validDate = moment().toDate();
    return date > validDate;
  }

  renderUserType(): JSX.Element {
    return (
      <Dropdown
        title={this.$t('seller')}
        options={this.sellerOptions}
        width="100%"
        height="48px"
        variant="material"
        value={this.sellerSelected}
        changeOptionValue={this.onChangeSeller}
        placeholder={this.$t('seller')}
        overflow
        allowEmpty={false}
        internalSearch={false}
        searchChange={(value: string) => {
          this.searchPartnerSellers(value);
        }}
      />
    );
  }

  renderAction(hasErrors: boolean): JSX.Element {
    return (
      <Styled.Action>
        <Button
          width="100%"
          type="submit"
          label={this.$t('save')}
          variant="primary"
          isLoading={this.isSubmitting}
          disabled={this.isDisabledSubmit || hasErrors}
        />
      </Styled.Action>
    );
  }

  renderPrice(): JSX.Element {
    return (
      <InputPrice
        disabled={this.isSubmitting}
        messageErrors={this.messageErrors}
        changeCurrency={this.onChangeCurrency}
        changeInput={this.onClearMessageErrors}
        name="price"
      />
    );
  }

  renderPurchaseOrderNumber(): JSX.Element {
    return (
      <Styled.Row>
        <Input
          label={this.$t('purchase_order_number')}
          name="purchaseOrderNumber"
          variant="material"
          height="48px"
          placeholder={this.$t('purchase_order_number')}
          validation="bail|required"
          disabled={this.isSubmitting}
          changeValue={this.onClearMessageErrors}
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('purchase_order_number').toLowerCase(),
            }),
          }}
        />
        {this.messageErrors && (
          <MessageError
            field="purchaseOrderNumber"
            messageErrors={this.messageErrors}
          />
        )}
      </Styled.Row>
    );
  }

  renderDatetime(): JSX.Element {
    return (
      <DatePicker
        label={this.$t('date_time')}
        height="48px"
        type="datetime"
        variant="material"
        placeholder={this.$t('date_time')}
        value={this.transactedAt}
        disabledDate={this.disabledDatetime}
        disabledTime={this.disabledDatetime}
        selectDate={this.onChangeDateTime}
        disabled={this.isSubmitting}
        format={DATE_TIME_FORMAT}
      />
    );
  }

  renderPurchaseRecord(): JSX.Element {
    return (
      <FileUpload
        disabled={this.isSubmitting}
        label={this.$t('upload_receipt_purchase_record')}
        changeFiles={this.onChangeFiles}
      />
    );
  }

  renderForm(): JSX.Element {
    return (
      <formulate-form
        name={this.formName}
        v-model={this.formInput}
        vOn:submit={this.onSubmit}
        scopedSlots={{
          default: ({ hasErrors }: { hasErrors: boolean }) => (
            <Styled.Form>
              <Product
                productsDefault={this.products}
                success={this.onChangeLots}
              />
              {this.renderUserType()}
              {this.renderPrice()}
              {this.renderPurchaseOrderNumber()}
              {this.renderDatetime()}
              <Styled.Line />
              {this.renderPurchaseRecord()}
              {this.renderAction(hasErrors)}
            </Styled.Form>
          ),
        }}
      />
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Container>
        {this.isLoading && <SpinLoading />}
        {!this.isLoading && (
          <Styled.Wrapper>
            <Styled.Title>{this.$t('purchase')}</Styled.Title>
            {this.renderForm()}
          </Styled.Wrapper>
        )}
      </Styled.Container>
    );
  }
}
