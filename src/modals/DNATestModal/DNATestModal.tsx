import { Vue, Component, Prop } from 'vue-property-decorator';
import { isEmpty, pick } from 'lodash';
import moment from 'moment';
import {
  createDNATest,
  getProductSuppliers,
  getRequestingFacilities,
} from 'api/dna-management';
import { convertDateToTimestamp, dateToISOString } from 'utils/date';
import { handleError } from 'components/Toast';
import Button from 'components/FormUI/Button';
import { SpinLoading } from 'components/Loaders';
import ProductHistory from './elements/ProductHistory';
import Result from './elements/Result';
import * as Styled from './styled';

const ConfirmModal = () => import('modals/ConfirmModal');

@Component
export default class DNATestModal extends Vue {
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
  };
  private requestFacilityOptions: App.DropdownOption[] = [];
  private selectedRequestFacility: App.DropdownOption = null;
  private productSupplierOptions: App.DropdownOption[] = [];
  private selectedProductSupplier: App.DropdownOption = null;

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
      testedAt: dateToISOString(value),
    });
  }

  get isDisabledSubmit(): boolean {
    return (
      !this.selectedProductSupplier ||
      !this.selectedRequestFacility ||
      !this.testedAt ||
      (isEmpty(this.formInput.dnaIdentifiers) &&
        this.formInput.isDetected === true) ||
      isEmpty(this.formInput.uploadProofs) ||
      this.isSubmitting
    );
  }

  created(): void {
    this.fetchData();
  }

  async fetchData(): Promise<void> {
    this.isLoading = true;
    await this.getRequestingFacilities();
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

  closeModal(): void {
    this.$emit('close');
  }

  showStatusModal(status: boolean): void {
    const icon = status ? 'check_circle' : 'warning';
    const iconColor = status ? 'highland' : 'red';
    const title = status
      ? this.$t('createDNATestModal.DNA_matched')
      : this.$t('createDNATestModal.DNA_not_match');
    this.$modal.show(
      ConfirmModal,
      {
        icon: icon,
        iconSize: '63',
        iconColor: iconColor,
        message: title,
        confirmButtonWidth: '120px',
        confirmLabel: this.$t('common.action.ok'),
        showCancelButton: false,
      },
      { width: '351px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  getCreateDNATestParams(): DNAManagement.CreateDNATestParams {
    return {
      ...this.formData,
      requestFacilityId: this.selectedRequestFacility.id as string,
      productSupplierId: this.selectedProductSupplier.id as string,
      testedAt: convertDateToTimestamp(this.testedAt),
    };
  }

  async createDNATest(): Promise<void> {
    this.isSubmitting = true;
    try {
      const status = await createDNATest(this.getCreateDNATestParams());
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
  }

  changeProductId(value: string): void {
    this.formInput.productId = value;
  }

  changeTestedAt(date: string): void {
    this.testedAt = moment(date).toDate();
  }

  changeUploadFiles(selectedFiles: App.SelectedFile[]): void {
    this.formInput.uploadProofs = selectedFiles.map(({ file }) => file);
  }

  changeDNA(isDetected: boolean, dnaIdentifiers: string[]): void {
    this.formInput.isDetected = isDetected;
    this.formInput.dnaIdentifiers = dnaIdentifiers;
  }

  renderActions(hasErrors: boolean): JSX.Element {
    return (
      <Styled.Actions>
        <Button
          width="100%"
          label={this.$t('common.action.cancel')}
          variant="transparentPrimary"
          click={this.closeModal}
        />
        <Button
          width="100%"
          type="submit"
          label={this.$t('common.action.validate_results')}
          variant="primary"
          disabled={hasErrors || this.isDisabledSubmit}
        />
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
                  requestFacilityOptions={this.requestFacilityOptions}
                  selectedRequestFacility={this.selectedRequestFacility}
                  productSupplierOptions={this.productSupplierOptions}
                  selectedProductSupplier={this.selectedProductSupplier}
                  changeRequestFacility={this.changeRequestFacility}
                  changeProductSupplier={this.changeProductSupplier}
                  changeProductId={this.changeProductId}
                />
                <Result
                  isSubmitting={this.isSubmitting}
                  testedAt={this.testedAt}
                  changeTestedAt={this.changeTestedAt}
                  changeUploadFiles={this.changeUploadFiles}
                  changeDNA={this.changeDNA}
                />
              </perfect-scrollbar>
              <Styled.Actions>
                <Button
                  width="100%"
                  label={this.$t('common.action.cancel')}
                  variant="transparentPrimary"
                  click={this.closeModal}
                />
                <Button
                  width="100%"
                  type="submit"
                  label={this.$t('common.action.validate_results')}
                  variant="primary"
                  disabled={hasErrors || this.isDisabledSubmit}
                />
              </Styled.Actions>
            </Styled.Wrapper>
          ),
        }}
      />
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout title={this.$t('dna_test')} showCloseIcon={false}>
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
