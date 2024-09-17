import { Vue, Component, Prop } from 'vue-property-decorator';
import { find, get, head, isEmpty, isNull, map, omit, pick } from 'lodash';
import {
  updateSupplier,
  createSupplier,
  getBusinessPartners,
  getBrandRoles,
} from 'api/brand-supplier';
import Button from 'components/FormUI/Button';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import ModalContent from './elements/ModalContent';
import * as Styled from './styled';

@Component
export default class BrandSupplierModal extends Vue {
  @Prop({ default: null }) readonly supplier: Auth.Facility;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  onSuccess: (supplier?: Auth.Facility) => void;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  onClose: () => void;

  private formInput: BrandSupplier.SupplierRequestParams = {
    name: '',
    businessRegisterNumber: '',
    oarId: '',
    typeId: null,
    firstName: '',
    lastName: '',
    email: '',
    businessPartnerIds: [],
    facilityId: '',
  };
  private isLoading: boolean = false;
  private isSubmitting: boolean = false;
  private facility: Auth.Facility = null;
  private facilityTypeSelected: App.DropdownOption = null;
  private roles: RoleAndPermission.Role[] = [];
  private partnerOptions: App.DropdownOption[] = [];
  private formName: string = 'brandSupplierForm';
  private messageErrors: App.MessageError = null;

  get formData(): BrandSupplier.SupplierRequestParams {
    return this.$formulate.registry.get(this.formName).proxy;
  }

  get isEdit(): boolean {
    return !isEmpty(this.supplier);
  }

  get facilityTypeOptions(): App.DropdownOption[] {
    return this.roles.map(({ id, name }) => ({ id, name }));
  }

  get isEmptyFacility(): boolean {
    return isEmpty(this.facility);
  }

  get isDisabledInput(): boolean {
    return this.isEdit ? false : this.isSubmitting || !this.isEmptyFacility;
  }

  get isDisabledChangeType(): boolean {
    return !this.isEdit && !this.isEmptyFacility;
  }

  get title(): string {
    if (this.isEdit) {
      return this.$t('edit_supplier');
    }
    return this.$t('add_new_supplier');
  }

  get keySuccessMessage(): string {
    if (this.isEdit) {
      return this.$t('successfully_saved');
    }
    return isNull(this.facility)
      ? this.$t('create_and_send_supplier_success')
      : this.$t('create_supplier_success');
  }

  get buttonLabelText(): string {
    return this.isEdit ? this.$t('common.action.save_changes') : this.$t('add');
  }

  created(): void {
    this.getBrandRoles();
  }

  async getBrandRoles(): Promise<void> {
    this.isLoading = true;
    try {
      this.roles = await getBrandRoles();
      if (this.isEdit) {
        this.initEditData();
      }
      await this.getListBusinessPartner();
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  initEditData(): void {
    this.onSetFacility(this.supplier);
    const { name, facilityPartners, typeId } = this.supplier;
    this.formInput.name = name;
    this.formInput.facilityId = '';
    this.formInput.typeId = typeId;
    this.formInput.businessPartnerIds = facilityPartners.map(
      (partner) => partner.partnerId,
    );
    this.onChangeType(find(this.facilityTypeOptions, ['id', typeId]));
  }

  closeModal(): void {
    this.onClose();
    this.$emit('close');
  }

  async getListBusinessPartner(): Promise<void> {
    try {
      let partners = await getBusinessPartners({
        roleId: get(this.facilityTypeSelected, 'id') as string,
      });
      if (this.facility) {
        partners = partners.filter(({ id }) => id !== this.facility.id);
      }
      this.partnerOptions = map(partners, (partner) =>
        pick(partner, 'id', 'name'),
      );
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  onChangeBusinessPartners(options: App.DropdownOption[]): void {
    this.formInput.businessPartnerIds = options.map((option) => `${option.id}`);
  }

  onChangeType(option: App.DropdownOption = null): void {
    this.facilityTypeSelected = option;
    this.formInput.typeId = option ? (option.id as string) : null;
    this.getListBusinessPartner();
  }

  onSetFacility(facility: Auth.Facility = null): void {
    this.facility = facility;
    this.setFacilityInfo(facility);
    this.setUserInfo(facility);
    if (facility) {
      this.getListBusinessPartner();
    }
  }

  setFacilityInfo(facility?: Auth.Facility): void {
    this.formInput.oarId = get(facility, 'oarId', '');
    this.formInput.facilityId = get(facility, 'id', '');
    this.formInput.businessRegisterNumber = get(
      facility,
      'businessRegisterNumber',
    );
    this.setFacilityType(facility);
  }

  setFacilityType(facility?: Auth.Facility): void {
    const role = this.roles.find(({ id }) => id === get(facility, 'typeId'));
    this.facilityTypeSelected = role
      ? {
          id: role.id,
          name: role.name,
        }
      : null;
  }

  setUserInfo(facility?: Auth.Facility): void {
    const users = get(facility, 'users');
    const user = head(users);
    this.formInput.firstName = get(user, 'firstName', '');
    this.formInput.lastName = get(user, 'lastName', '');
    this.formInput.email = get(user, 'email', '');
  }

  onChangeName(value: string): void {
    this.formInput.name = value;
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  async onSubmit(): Promise<void> {
    this.isSubmitting = true;
    try {
      let payload = this.formData;
      if (isEmpty(payload.oarId)) {
        payload = omit(payload, ['oarId']);
      }
      if (isEmpty(payload.businessRegisterNumber)) {
        payload = omit(payload, ['businessRegisterNumber']);
      }
      if (isEmpty(payload.facilityId)) {
        payload = omit(payload, ['facilityId']);
      } else {
        payload = omit(payload, ['name']);
      }
      if (this.isEdit) {
        await updateSupplier(this.supplier.id, payload);
        this.onSuccess();
      } else {
        const supplier = await createSupplier(payload);
        this.onSuccess(supplier);
      }
      this.$toast.success(this.keySuccessMessage);
      this.$emit('close');
    } catch (error) {
      this.messageErrors = get(error, 'errors');
    } finally {
      this.isSubmitting = false;
    }
  }

  renderActions(hasErrors: boolean): JSX.Element {
    return (
      <Styled.Actions>
        <Styled.ButtonGroupEnd>
          <Button
            variant="transparentPrimary"
            label={this.$t('common.action.cancel')}
            disabled={this.isSubmitting}
            click={this.closeModal}
          />
          <Button
            type="button"
            variant="primary"
            label={this.buttonLabelText}
            isLoading={this.isSubmitting}
            click={this.onSubmit}
            disabled={this.isSubmitting || (hasErrors && isNull(this.facility))}
          />
        </Styled.ButtonGroupEnd>
      </Styled.Actions>
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout closeModal={this.closeModal} title={this.title}>
        <Styled.Content>
          {this.isLoading && <SpinLoading isInline={false} />}
          {!this.isLoading && (
            <formulate-form
              v-model={this.formInput}
              name={this.formName}
              scopedSlots={{
                default: ({ hasErrors }: { hasErrors: boolean }) => (
                  <fragment>
                    <ModalContent
                      isEdit={this.isEdit}
                      supplier={this.supplier}
                      messageErrors={this.messageErrors}
                      disabled={this.isDisabledInput}
                      disabledFacilityType={this.isDisabledChangeType}
                      facilityTypeDefault={this.facilityTypeSelected}
                      facilityTypeOptions={this.facilityTypeOptions}
                      partnerOptions={this.partnerOptions}
                      setFacility={this.onSetFacility}
                      changeType={this.onChangeType}
                      changeInput={this.onClearMessageErrors}
                      changeBusinessPartners={this.onChangeBusinessPartners}
                      changeName={this.onChangeName}
                    />
                    {this.renderActions(hasErrors)}
                  </fragment>
                ),
              }}
            />
          )}
        </Styled.Content>
      </modal-layout>
    );
  }
}
