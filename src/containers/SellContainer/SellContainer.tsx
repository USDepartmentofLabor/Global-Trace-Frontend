/* eslint-disable max-lines */
import { Vue, Component } from 'vue-property-decorator';
import moment from 'moment';
import { some, isEmpty, map, omit } from 'lodash';
import sellProduct from 'store/modules/sell-product';
import { ProductStatusEnum } from 'enums/product';
import { DATE_TIME_FORMAT } from 'config/constants';
import { dateToISOString, convertDateToTimestamp } from 'utils/date';
import { getUploadFileObjectParams } from 'utils/helpers';
import { SpinLoading } from 'components/Loaders';
import { handleError } from 'components/Toast';
import Dropdown from 'components/FormUI/Dropdown';
import InputPrice from 'components/FormUI/Input/InputPrice';
import DatePicker from 'components/FormUI/DatePicker';
import FileUpload from 'components/FormUI/FileUpload';
import Input from 'components/FormUI/Input';
import Button from 'components/FormUI/Button/Button';
import CreateProduct from 'components/CreateProduct';
import * as Styled from './styled';

@Component
export default class SellContainer extends Vue {
  private isSubmitting: boolean = false;
  private formInput: SellProduct.RequestParams = {
    productIds: [],
    toFacilityId: '',
    price: null,
    currency: '',
    transactedAt: null,
    invoiceNumber: null,
    packingListNumber: null,
    uploadInvoices: [],
    uploadPackingLists: [],
  };
  private isLoading: boolean = false;
  private purchaserSelected: App.DropdownOption = null;
  private messageErrors: App.MessageError = null;
  private formName: string = 'sellProductForm';
  private products: ProductManagement.Product[] = [];
  private hasErrorUploadInvoices: boolean = false;
  private hasErrorUploadPackings: boolean = false;

  get formData(): SellProduct.RequestParams {
    return this.$formulate.registry.get(this.formName).proxy;
  }

  get transactedAt(): Date {
    const { transactedAt } = this.formData;
    return transactedAt ? moment(transactedAt).toDate() : null;
  }

  set transactedAt(value: Date) {
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      transactedAt: value ? dateToISOString(value) : null,
    });
  }

  get purchaserOptions(): App.DropdownOption[] {
    return sellProduct.partnerPurchasers;
  }

  get isDisabledSubmit(): boolean {
    const { toFacilityId, uploadInvoices, uploadPackingLists, transactedAt } =
      this.formInput;
    return (
      this.isSubmitting ||
      this.products.length === 0 ||
      isEmpty(toFacilityId) ||
      isEmpty(uploadInvoices) ||
      isEmpty(uploadPackingLists) ||
      isEmpty(transactedAt) ||
      this.hasErrorUploadInvoices ||
      this.hasErrorUploadPackings
    );
  }

  created(): void {
    this.initPartnerPurchaser();
  }

  initPartnerPurchaser(): void {
    this.isLoading = true;
    sellProduct.getPartnerPurchaser({
      params: { key: '' },
      callback: {
        onFailure: (error: App.ResponseError) => {
          handleError(error);
        },
        onFinish: () => {
          this.isLoading = false;
        },
      },
    });
  }

  searchPartnerPurchaser(searchText: string): void {
    sellProduct.getPartnerPurchaser({
      params: { key: searchText },
      callback: {
        onFailure: (error: App.ResponseError) => {
          handleError(error);
        },
      },
    });
  }

  async getSellRequestParams(): Promise<SellProduct.RequestParams> {
    let payloads: SellProduct.RequestParams;

    this.formData.productIds = map(this.products, 'id');
    if (isEmpty(this.formData.price)) {
      payloads = omit(this.formData, ['currency', 'price']);
    } else {
      payloads = this.formData;
    }
    payloads.transactedAt = convertDateToTimestamp(this.transactedAt);
    payloads.uploadInvoices = await getUploadFileObjectParams(
      this.formInput.uploadInvoices,
    );
    payloads.uploadPackingLists = await getUploadFileObjectParams(
      this.formInput.uploadPackingLists,
    );

    return payloads;
  }

  async onSubmit(): Promise<void> {
    this.isSubmitting = true;
    const payloads = await this.getSellRequestParams();
    sellProduct.sellProduct({
      data: payloads,
      callback: {
        onSuccess: () => {
          this.$router.push({ name: 'Homepage' });
          this.$toast.success(this.$t('data_saved'));
        },
        onFailure: (error: App.ResponseError) => {
          handleError(error);
        },
        onFinish: () => {
          this.isSubmitting = false;
        },
      },
    });
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  onChangePurchaser(option: App.DropdownOption): void {
    this.purchaserSelected = option;
    this.formInput.toFacilityId = option ? (option.id as string) : null;
  }

  onChangeCurrency(currency: string): void {
    this.formInput.currency = currency;
    this.onClearMessageErrors();
  }

  onChangeDateTime(transactedAt: string): void {
    this.transactedAt = transactedAt ? moment(transactedAt).toDate() : null;
  }

  isErrorUploadFiles(selectedFiles: App.SelectedFile[]) {
    return some(selectedFiles, ['isError', true]);
  }

  onChangeInvoiceFiles(selectedFiles: App.SelectedFile[]): void {
    this.hasErrorUploadInvoices = this.isErrorUploadFiles(selectedFiles);
    this.formInput.uploadInvoices = selectedFiles.map(({ file }) => file);
  }

  onChangePackageFiles(selectedFiles: App.SelectedFile[]): void {
    this.hasErrorUploadPackings = this.isErrorUploadFiles(selectedFiles);
    this.formInput.uploadPackingLists = selectedFiles.map(({ file }) => file);
  }

  onChangeProducts(products: ProductManagement.Product[]): void {
    this.products = products;
  }

  disabledDatetime(date: Date): boolean {
    const validDate = moment().toDate();
    return date > validDate;
  }

  renderPartnerPurchaser(): JSX.Element {
    return (
      <Styled.Row>
        <Dropdown
          title={this.$t('purchaser')}
          options={this.purchaserOptions}
          width="100%"
          height="48px"
          value={this.purchaserSelected}
          changeOptionValue={this.onChangePurchaser}
          placeholder={this.$t('purchaser')}
          allowEmpty={false}
          internalSearch={false}
          searchChange={(value: string) => {
            this.searchPartnerPurchaser(value);
          }}
        />
      </Styled.Row>
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

  renderDatetime(): JSX.Element {
    return (
      <Styled.Row>
        <DatePicker
          label={this.$t('date_time')}
          height="48px"
          type="datetime"
          placeholder={this.$t('date_time')}
          value={this.transactedAt}
          selectDate={this.onChangeDateTime}
          disabled={this.isSubmitting}
          format={DATE_TIME_FORMAT}
          disabledDate={this.disabledDatetime}
          disabledTime={this.disabledDatetime}
        />
      </Styled.Row>
    );
  }

  renderInvoice(): JSX.Element {
    return (
      <fragment>
        <Styled.Row>
          <Input
            name="invoiceNumber"
            label={this.$t('invoice_number')}
            placeholder={this.$t('invoice_number')}
            disabled={this.isSubmitting}
            height="48px"
            validation="bail|required"
            validationMessages={{
              required: this.$t('validation.required', {
                field: this.$t('invoice_number').toLowerCase(),
              }),
            }}
          />
        </Styled.Row>
        <Styled.Row>
          <FileUpload
            values={[]}
            disabled={this.isSubmitting}
            label={this.$t('upload_invoice')}
            changeFiles={this.onChangeInvoiceFiles}
            inputId="uploadInvoices"
          />
        </Styled.Row>
      </fragment>
    );
  }

  renderPackageList(): JSX.Element {
    return (
      <fragment>
        <Styled.Row>
          <Input
            name="packingListNumber"
            label={this.$t('package_list_number')}
            placeholder={this.$t('package_list_number')}
            disabled={this.isSubmitting}
            height="48px"
            validation="bail|required"
            validationMessages={{
              required: this.$t('validation.required', {
                field: this.$t('package_list_number').toLowerCase(),
              }),
            }}
          />
        </Styled.Row>
        <Styled.Row>
          <FileUpload
            values={[]}
            disabled={this.isSubmitting}
            label={this.$t('upload_package_list')}
            changeFiles={this.onChangePackageFiles}
            inputId="uploadPackingLists"
          />
        </Styled.Row>
      </fragment>
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
            <Styled.Wrapper>
              <perfect-scrollbar>
                <Styled.Form>
                  <CreateProduct
                    status={ProductStatusEnum.SELL}
                    productsDefault={this.products}
                    success={this.onChangeProducts}
                  />
                  {this.renderPartnerPurchaser()}
                  {this.renderPrice()}
                  {this.renderDatetime()}
                  {this.renderInvoice()}
                  {this.renderPackageList()}
                  <Styled.Action>
                    <Button
                      width="100%"
                      type="submit"
                      label={this.$t('common.action.save_changes')}
                      variant="primary"
                      isLoading={this.isSubmitting}
                      disabled={hasErrors || this.isDisabledSubmit}
                    />
                  </Styled.Action>
                </Styled.Form>
              </perfect-scrollbar>
            </Styled.Wrapper>
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
            <Styled.Title>{this.$t('sell')}</Styled.Title>
            {this.renderForm()}
          </Styled.Wrapper>
        )}
      </Styled.Container>
    );
  }
}
