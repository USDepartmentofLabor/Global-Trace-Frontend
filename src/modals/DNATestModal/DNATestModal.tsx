import { Vue, Component, Prop } from 'vue-property-decorator';
import { flatMap, get, isEmpty, pick } from 'lodash';
import moment from 'moment';
import {
  createDNATest,
  createIsotopicDNATest,
  getProductSuppliers,
  getRequestingFacilities,
  validateProduct,
} from 'api/dna-management';
import { convertDateToTimestamp, dateToISOString } from 'utils/date';
import { handleError } from 'components/Toast';
import Button from 'components/FormUI/Button';
import { AddDNAOptionEnum } from 'enums/dna';
import location from 'store/modules/location';
import { SpinLoading } from 'components/Loaders';
import ProductHistory from './elements/ProductHistory';
import Result from './elements/Result';
import * as Styled from './styled';

const DNAResultModal = () => import('modals/DNAResultModal');

@Component
export default class DNATestModal extends Vue {
  @Prop({ required: true }) type: AddDNAOptionEnum;
  @Prop({ required: true }) onSuccess: () => void;

  private isSubmitting: boolean = false;
  private isLoading: boolean = false;
  private messageErrors: App.MessageError = null;
  private formName: string = 'DNATest';
  private formInput: DNAManagement.CreateDNATestParams = {
    requestFacilityId: '',
    productSupplierId: '',
    productId: '',
    testedAt: null,
    isDetected: null,
    dnaIdentifiers: [],
    uploadProofs: [],
    countryIds: [],
  };
  private requestFacilityOptions: App.DropdownOption[] = [];
  private selectedRequestFacility: App.DropdownOption = null;
  private productSupplierOptions: App.DropdownOption[] = [];
  private selectedProductSupplier: App.DropdownOption = null;
  private countriesSelected: App.DropdownOption[] = [];

  get title(): string {
    return this.type === AddDNAOptionEnum.ISOTOPIC
      ? this.$t('isotopic_DNA_test')
      : this.$t('synthetic_DNA_marking');
  }

  get formData(): DNAManagement.CreateDNATestParams {
    return this.$formulate.registry.get(this.formName).proxy;
  }

  get testedAt(): Date {
    const { testedAt } = this.formData;
    return testedAt ? moment(testedAt).toDate() : null;
  }

  set testedAt(value: Date) {
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      testedAt: value ? dateToISOString(value) : null,
    });
  }

  get isInvalidInput(): boolean {
    return (
      !this.selectedProductSupplier ||
      !this.testedAt ||
      (isEmpty(this.formInput.dnaIdentifiers) &&
        this.formInput.isDetected === true) ||
      isEmpty(this.formInput.uploadProofs) ||
      this.isSubmitting
    );
  }

  get isDisabledSubmit(): boolean {
    if (this.type === AddDNAOptionEnum.ISOTOPIC) {
      return isEmpty(this.countriesSelected) || this.isInvalidInput;
    }
    return !this.selectedProductSupplier || this.isInvalidInput;
  }

  created(): void {
    this.fetchData();
  }

  async fetchData(): Promise<void> {
    this.isLoading = true;
    if (this.type === AddDNAOptionEnum.SYNTHETIC) {
      await this.getRequestingFacilities();
    } else {
      await this.initLocation();
    }
    await this.getProductSuppliers();
    this.isLoading = false;
  }

  async getRequestingFacilities(): Promise<void> {
    try {
      const requestingFacilities = await getRequestingFacilities();
      this.requestFacilityOptions = requestingFacilities.map(
        (facility: Auth.Facility) => pick(facility, ['id', 'name']),
      );
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  async getProductSuppliers(): Promise<void> {
    try {
      const productSuppliers = await getProductSuppliers();
      this.productSupplierOptions = productSuppliers.map(
        (facility: Auth.Facility) => pick(facility, ['id', 'name']),
      );
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  initLocation(): Promise<void> {
    return location.getCountries({
      callback: {
        onFailure: (error: App.ResponseError) => {
          handleError(error);
        },
      },
    });
  }

  closeModal(): void {
    this.$emit('close');
  }

  showStatusModal(isSuccess: boolean): void {
    const productId = this.formInput.productId;
    const facilityName = get(this.selectedProductSupplier, 'name');
    const DNAIdentifiers = this.formInput.dnaIdentifiers;
    const countries = flatMap(this.countriesSelected, 'name');
    this.$modal.show(
      DNAResultModal,
      {
        isSuccess,
        productId,
        facilityName,
        DNAIdentifiers,
        countries,
        type: this.type,
      },
      { width: '480px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  getCreateDNATestParams(): DNAManagement.CreateDNATestParams {
    return {
      ...this.formData,
      requestFacilityId: get(this.selectedRequestFacility, 'id', '') as string,
      productSupplierId: get(this.selectedProductSupplier, 'id', '') as string,
      countryIds: flatMap(this.countriesSelected, 'id'),
      testedAt: convertDateToTimestamp(this.testedAt),
    };
  }

  async createDNATest(): Promise<void> {
    this.isSubmitting = true;
    try {
      const payload = this.getCreateDNATestParams();
      const requestApi =
        this.type === AddDNAOptionEnum.ISOTOPIC
          ? createIsotopicDNATest
          : createDNATest;
      const status = await requestApi(payload);
      this.showStatusModal(status);
      this.onSuccess();
      this.closeModal();
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isSubmitting = false;
    }
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  changeRequestFacility(option: App.DropdownOption): void {
    this.selectedRequestFacility = option;
  }

  changeProductSupplier(option: App.DropdownOption): void {
    this.selectedProductSupplier = option;
    this.validateProductId(this.formInput.productId);
  }

  changeProductId(value: string): void {
    this.formInput.productId = value;
    this.validateProductId(value);
  }

  async validateProductId(productId: string): Promise<void> {
    try {
      if (!isEmpty(productId)) {
        await validateProduct({
          productId,
          productSupplierId: get(this.selectedProductSupplier, 'id') as string,
        });
      }
      this.onClearMessageErrors();
    } catch (error) {
      this.messageErrors = get(error, 'errors');
    }
  }

  changeTestedAt(date: string): void {
    this.testedAt = date ? moment(date).toDate() : null;
  }

  changeUploadFiles(selectedFiles: App.SelectedFile[]): void {
    this.formInput.uploadProofs = selectedFiles.map(({ file }) => file);
  }

  changeCountries(options: App.DropdownOption[]) {
    this.countriesSelected = options;
  }

  changeDNA(isDetected: boolean, dnaIdentifiers: string[]): void {
    this.formInput.isDetected = isDetected;
    this.formInput.dnaIdentifiers = dnaIdentifiers;
  }

  renderActions(hasErrors: boolean): JSX.Element {
    return (
      <Styled.Actions>
        <Styled.ButtonGroupEnd>
          <Button
            label={this.$t('common.action.cancel')}
            variant="transparentPrimary"
            click={this.closeModal}
          />
          <Button
            type="submit"
            label={this.$t('common.action.validate_results')}
            variant="primary"
            disabled={hasErrors || this.isDisabledSubmit}
          />
        </Styled.ButtonGroupEnd>
      </Styled.Actions>
    );
  }

  renderForm(): JSX.Element {
    return (
      <formulate-form
        name={this.formName}
        v-model={this.formInput}
        vOn:submit={this.createDNATest}
        scopedSlots={{
          default: ({ hasErrors }: { hasErrors: boolean }) => (
            <Styled.Wrapper>
              <perfect-scrollbar>
                <ProductHistory
                  isSubmitting={this.isSubmitting}
                  type={this.type}
                  requestFacilityOptions={this.requestFacilityOptions}
                  selectedRequestFacility={this.selectedRequestFacility}
                  productSupplierOptions={this.productSupplierOptions}
                  selectedProductSupplier={this.selectedProductSupplier}
                  messageErrors={this.messageErrors}
                  changeRequestFacility={this.changeRequestFacility}
                  changeProductSupplier={this.changeProductSupplier}
                  changeProductId={this.changeProductId}
                />
                <Result
                  isSubmitting={this.isSubmitting}
                  type={this.type}
                  testedAt={this.testedAt}
                  countriesSelected={this.countriesSelected}
                  changeTestedAt={this.changeTestedAt}
                  changeUploadFiles={this.changeUploadFiles}
                  changeDNA={this.changeDNA}
                  changeCountries={this.changeCountries}
                />
              </perfect-scrollbar>
              {this.renderActions(hasErrors)}
            </Styled.Wrapper>
          ),
        }}
      />
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout title={this.title} closeModal={this.closeModal}>
        {this.isLoading && (
          <Styled.Loading>
            <SpinLoading />
          </Styled.Loading>
        )}
        {!this.isLoading && this.renderForm()}
      </modal-layout>
    );
  }
}
