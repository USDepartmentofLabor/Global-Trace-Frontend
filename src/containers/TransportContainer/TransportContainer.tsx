import { Vue, Component } from 'vue-property-decorator';
import { some, isEmpty, map, sumBy } from 'lodash';
import moment from 'moment';
import { dateToISOString, convertDateToTimestamp } from 'utils/date';
import {
  convertKgToUnit,
  convertUnitToKg,
  formatWeight,
  getUploadFileObjectParams,
} from 'utils/helpers';
import transportModule from 'store/modules/transport';
import { ProductStatusEnum, WeightUnit } from 'enums/product';
import { DATE_TIME_FORMAT } from 'config/constants';
import { handleError } from 'components/Toast';
import CreateProduct from 'components/CreateProduct';
import Button from 'components/FormUI/Button';
import DatePicker from 'components/FormUI/DatePicker';
import Dropdown from 'components/FormUI/Dropdown';
import FileUpload from 'components/FormUI/FileUpload';
import InputWeight from 'components/FormUI/Input/InputWeight';
import Input from 'components/FormUI/Input';
import { SpinLoading } from 'components/Loaders';
import * as Styled from './styled';

@Component
export default class TransportContainer extends Vue {
  private isSubmitting: boolean = false;
  private formInput: Transport.RequestParams = {
    productIds: [],
    fabricIds: [],
    toFacilityId: '',
    totalWeight: null,
    weightUnit: '',
    transactedAt: null,
    packingListNumber: null,
    uploadPackingLists: [],
  };
  private isLoading: boolean = false;
  private transporterSelected: App.DropdownOption = null;
  private messageErrors: App.MessageError = null;
  private formName: string = 'transportForm';
  private products: Transport.Product[] = [];
  private minTotalWeight: number | null = null;
  private hasErrorUpload: boolean = false;

  get formData(): Transport.RequestParams {
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

  get transporterOptions(): App.DropdownOption[] {
    return transportModule.partnerTransporters;
  }

  get isDisabledSubmit(): boolean {
    const { toFacilityId, uploadPackingLists, transactedAt } = this.formInput;
    return (
      this.isSubmitting ||
      this.products.length === 0 ||
      isEmpty(toFacilityId) ||
      isEmpty(transactedAt) ||
      isEmpty(uploadPackingLists) ||
      this.hasErrorUpload
    );
  }

  created(): void {
    if (transportModule.partnerTransporters.length == 0) {
      this.isLoading = true;
      transportModule.getPartnerTransporter({
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
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  onChangeTransporter(option: App.DropdownOption): void {
    this.transporterSelected = option;
    this.formInput.toFacilityId = option ? (option.id as string) : null;
  }

  onChangeUnit(id: string): void {
    this.formInput.weightUnit = id;
    this.updateTotalWeight();
    this.onClearMessageErrors();
  }

  onChangeDateTime(transactedAt: string): void {
    this.transactedAt = transactedAt ? moment(transactedAt).toDate() : null;
  }

  onChangeFiles(selectedFiles: App.SelectedFile[]): void {
    this.hasErrorUpload = some(selectedFiles, ['isError', true]);
    this.formInput.uploadPackingLists = selectedFiles.map(({ file }) => file);
  }

  onChangeProducts(products: Transport.Product[]): void {
    this.products = products;
    this.updateTotalWeight();
    this.onClearMessageErrors();
  }

  updateTotalWeight(): void {
    const productsWeightTotal = this.getProductsWeightTotal();
    const totalWeight = productsWeightTotal > 0 ? productsWeightTotal : null;
    const isDisableValidateMinWeight = this.disableValidateMinWeight();
    if (!isDisableValidateMinWeight) {
      this.formInput.totalWeight = totalWeight;
    }
    this.minTotalWeight = isDisableValidateMinWeight ? 1 : totalWeight;
  }

  getProductsWeightTotal(): number {
    const total = sumBy(this.products, (product: Transport.Product) =>
      convertUnitToKg(product.quantity, product.quantityUnit),
    );
    return formatWeight(convertKgToUnit(total, this.formInput.weightUnit));
  }

  disableValidateMinWeight(): boolean {
    return this.products.some(
      ({ quantityUnit }) =>
        quantityUnit !== WeightUnit.KG &&
        quantityUnit !== WeightUnit.UNIT &&
        quantityUnit !== WeightUnit.LBS,
    );
  }

  async onSubmit(): Promise<void> {
    this.isSubmitting = true;
    const productIds = map(this.products, 'id');

    this.formData.productIds = productIds;
    transportModule.createTransport({
      data: {
        ...this.formData,
        transactedAt: convertDateToTimestamp(this.transactedAt),
        uploadPackingLists: await getUploadFileObjectParams(
          this.formData.uploadPackingLists as File[],
        ),
      },
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

  disabledDatetime(date: Date): boolean {
    const validDate = moment().toDate();
    return date > validDate;
  }

  renderUserType(): JSX.Element {
    return (
      <Styled.Row>
        <Dropdown
          title={this.$t('transporter')}
          options={this.transporterOptions}
          width="100%"
          height="48px"
          value={this.transporterSelected}
          changeOptionValue={this.onChangeTransporter}
          placeholder={this.$t('transporter')}
          allowEmpty={false}
        />
      </Styled.Row>
    );
  }

  renderWeight(): JSX.Element {
    return (
      <InputWeight
        minWeight={this.minTotalWeight}
        disabled={this.isSubmitting}
        messageErrors={this.messageErrors}
        changeUnit={this.onChangeUnit}
        changeInput={this.onClearMessageErrors}
        name="totalWeight"
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

  renderTransportRecord(): JSX.Element {
    return (
      <fragment>
        <Styled.Row>
          <Input
            name="packingListNumber"
            placeholder={this.$t('package_list_number')}
            label={this.$t('package_list_number')}
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
            label={this.$t('upload_transportation_log')}
            changeFiles={this.onChangeFiles}
            inputId="uploadPackingLists"
          />
        </Styled.Row>
      </fragment>
    );
  }

  renderAction(hasErrors: boolean): JSX.Element {
    return (
      <Styled.Action>
        <Button
          width="100%"
          type="submit"
          label={this.$t('common.action.save_changes')}
          variant="primary"
          isLoading={this.isSubmitting}
          disabled={this.isDisabledSubmit || hasErrors}
        />
      </Styled.Action>
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
              <CreateProduct
                isSell={false}
                status={ProductStatusEnum.TRANSPORT}
                productsDefault={this.products}
                success={this.onChangeProducts}
              />
              {this.renderUserType()}
              {this.renderWeight()}
              {this.renderDatetime()}
              <Styled.Line />
              {this.renderTransportRecord()}
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
            <Styled.Title>{this.$t('transport')}</Styled.Title>
            {this.renderForm()}
          </Styled.Wrapper>
        )}
      </Styled.Container>
    );
  }
}
