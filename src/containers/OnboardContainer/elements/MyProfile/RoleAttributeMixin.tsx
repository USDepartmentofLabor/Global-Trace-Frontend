/* eslint-disable max-lines */
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  cloneDeep,
  filter,
  forOwn,
  get,
  has,
  isEmpty,
  isNumber,
  map,
  pick,
  values,
} from 'lodash';
import moment from 'moment';
import { convertDateToTimestamp } from 'utils/date';
import { getUserInfo, updateProfile } from 'api/user-setting';
import { handleError } from 'components/Toast';
import { getUploadFileObjectParams } from 'utils/helpers';
import Button from 'components/FormUI/Button';
import auth from 'store/modules/auth';
import { InputAttributeEnum } from 'enums/app';
import { validProduct } from 'utils/product-attributes';
import { ChainOfCustodyEnum, RoleAttributeTypeEnum } from 'enums/role';
import OpenSupplyHub from './OpenSupplyHub';
import CID from './CID';
import InternalId from './InternalId';
import AdditionalAttribute from './AdditionalAttribute';
import ContactProfile from './ContactProfile';
import BusinessModel from './BusinessModel';
import * as Styled from './styled';

@Component
export default class RoleAttributeMixin extends Vue {
  @Prop({
    default: () => {
      //
    },
  })
  exit: (reload: boolean) => void;

  private formInput: Onboard.ProfileRequestParams = {
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    certification: '',
    reconciliationStartAt: null,
    reconciliationDuration: '',
    goods: [],
  };
  public isLoading: boolean = false;
  private formName: string = 'myProfile';
  private isSubmitting: boolean = false;
  public messageErrors: { [x: string]: App.MessageError } = null;
  private userInfo: Auth.User = null;
  private systemAttributes: { [x: string]: Onboard.RoleAttributeParams[] } = {};
  private isValidAllAttributes = false;

  get formData(): Onboard.ProfileRequestParams {
    return this.$formulate.registry.get(this.formName).proxy;
  }

  get userMessageErrors(): App.MessageError {
    return get(this.messageErrors, 'user.children');
  }

  get roleAttributes(): Auth.RoleAttributes {
    return get(this.userInfo, 'roleAttributes');
  }

  get roleAttributeOrderKeys(): RoleAttributeTypeEnum[] {
    return get(this.userInfo, 'roleAttributeOrderKeys');
  }

  get chainOfCustody(): string {
    return get(
      this.userInfo.role,
      'chainOfCustody',
      ChainOfCustodyEnum.MASS_BALANCE,
    );
  }

  get hasOpenSupplyHub(): boolean {
    return has(this.roleAttributes, RoleAttributeTypeEnum.OPEN_SUPPLY_HUB_ID);
  }

  get hasCID(): boolean {
    return has(this.roleAttributes, RoleAttributeTypeEnum.RMI_CID);
  }

  get hasInternalId(): boolean {
    return has(
      this.roleAttributes,
      RoleAttributeTypeEnum.INTERNAL_INDENTIFIER_SYSTEM,
    );
  }

  get hasAdditionalAttribute(): boolean {
    return has(this.roleAttributes, RoleAttributeTypeEnum.ADDITIONAL_ATTRIBUTE);
  }

  get isMassBalance(): boolean {
    return this.chainOfCustody === ChainOfCustodyEnum.MASS_BALANCE;
  }

  get OSIDMessageErrors(): App.MessageError {
    return get(
      this.messageErrors,
      `${RoleAttributeTypeEnum.OPEN_SUPPLY_HUB_ID}.children`,
    );
  }

  get CIDMessageErrors(): App.MessageError {
    return get(this.messageErrors, `${RoleAttributeTypeEnum.RMI_CID}.children`);
  }

  get internalMessageErrors(): App.MessageError {
    return get(
      this.messageErrors,
      `${RoleAttributeTypeEnum.INTERNAL_INDENTIFIER_SYSTEM}.children`,
    );
  }

  get additionalAttributeMessageErrors(): App.MessageError {
    return get(
      this.messageErrors,
      `${RoleAttributeTypeEnum.ADDITIONAL_ATTRIBUTE}.children`,
    );
  }

  get isDisabledSubmitButton(): boolean {
    const {
      certification,
      reconciliationStartAt,
      goods,
      reconciliationDuration,
    } = this.formData;
    return (
      this.isLoading ||
      this.isSubmitting ||
      !this.isValidAllAttributes ||
      isEmpty(certification) ||
      isEmpty(goods) ||
      (this.isMassBalance &&
        (isEmpty(reconciliationStartAt) || isEmpty(reconciliationDuration)))
    );
  }

  created(): void {
    this.getUserInfo();
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  getUserParams(): Auth.User {
    const { firstName, lastName, phoneNumber, email } = this.formInput;
    return { firstName, lastName, phoneNumber, email };
  }

  getBusinessModelParams(): Onboard.BusinessModelParams {
    const {
      reconciliationStartAt,
      certification,
      goods,
      reconciliationDuration,
    } = this.formInput;
    return {
      certification,
      goods,
      chainOfCustody: this.chainOfCustody,
      reconciliationStartAt: convertDateToTimestamp(
        moment(reconciliationStartAt).toDate(),
      ),
      reconciliationDuration,
    };
  }

  async getRoleAttributesParams(): Promise<Auth.RoleAttribute[]> {
    let params: Auth.RoleAttribute[] = [];
    forOwn(this.systemAttributes, (attributes) => {
      params = [...params, ...attributes];
    });
    return await this.getValueUploadProofs(params);
  }

  async getValueUploadProofs(
    data: Auth.RoleAttribute[],
  ): Promise<Auth.RoleAttribute[]> {
    const roleAttributes = cloneDeep(data);
    await Promise.all(
      roleAttributes.map(
        async (roleAttribute: Auth.RoleAttribute) =>
          await this.getValueAttribute(roleAttribute),
      ),
    );
    return roleAttributes;
  }

  async getValueAttribute(
    roleAttribute: Auth.RoleAttribute,
  ): Promise<Auth.RoleAttribute> {
    if (this.isAttachment(roleAttribute)) {
      const oldFiles = get(roleAttribute, 'value.values');
      const uploadedFiles = await this.getUploadedFiles(
        get(roleAttribute, 'value.selectedFiles'),
      );
      const value = [...oldFiles, ...uploadedFiles];
      roleAttribute.value = filter(value, (item) => !isEmpty(item));
      return roleAttribute;
    }

    roleAttribute.value =
      isNumber(roleAttribute.value) || !isEmpty(roleAttribute.value)
        ? roleAttribute.value
        : null;
    return roleAttribute;
  }

  async getUploadedFiles(
    files: File[] = [],
  ): Promise<App.UploadFilesResponse[]> {
    try {
      return await getUploadFileObjectParams(files);
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  isAttachment(roleAttribute: Auth.RoleAttribute): boolean {
    return (
      get(roleAttribute, 'attribute.category') ===
      InputAttributeEnum.ATTACHMENTS
    );
  }

  async getFormParams(): Promise<Onboard.ProfileFormData> {
    return {
      user: this.getUserParams(),
      facility: this.getBusinessModelParams(),
      roleAttributes: await this.getRoleAttributesParams(),
    };
  }

  initContactInputValue(): void {
    const { firstName, lastName, email, phoneNumber } = this.userInfo;
    this.formInput = {
      ...this.formInput,
      firstName,
      lastName,
      email,
      phoneNumber,
    };
  }

  initRoleAttributes() {
    forOwn(this.roleAttributes, (attributes: Auth.RoleAttributes, key) => {
      this.systemAttributes[key] = map(
        attributes,
        ({ attribute, attributeId, value, quantityUnit, isOptional }) => ({
          attribute,
          isOptional,
          quantityUnit,
          attributeId,
          value,
          roleAttributeType: key,
          category: get(attribute, 'category'),
        }),
      );
    });
  }

  async getUserInfo(): Promise<void> {
    try {
      this.isLoading = true;
      const userInfo = await getUserInfo();
      this.userInfo = userInfo;
      this.initContactInputValue();
      this.initRoleAttributes();
      this.validateSystemAttributes();
    } catch (error) {
      handleError(error as App.ResponseError);
      this.messageErrors = get(error, 'errors');
    } finally {
      this.isLoading = false;
    }
  }

  async onSubmit(): Promise<void> {
    try {
      this.isSubmitting = true;
      const params = await this.getFormParams();
      await updateProfile(params);
      this.$toast.success(this.$t('onboardPage.profile_updated'));
      this.exit(true);
    } catch (error) {
      const errors = get(error, 'errors');
      if (values(errors).length > 0) {
        this.messageErrors = errors;
      } else {
        handleError(error as App.ResponseError);
      }
    } finally {
      this.isSubmitting = false;
    }
  }

  getInputAttributeParams(
    attributes: Onboard.RoleAttributeParams[],
  ): ProductAttribute.ValidateInputParams[] {
    return map(attributes, (attribute) =>
      pick(attribute, ['category', 'value', 'isOptional', 'quantityUnit']),
    );
  }

  validateSystemAttributes() {
    this.isValidAllAttributes = values(this.systemAttributes).every(
      (attributes: Onboard.RoleAttributeParams[]) =>
        validProduct(this.getInputAttributeParams(attributes)),
    );
  }

  onUpdateCID(params: Onboard.RoleAttributeParams[]): void {
    this.setSystemAttributes(RoleAttributeTypeEnum.RMI_CID, params);
  }

  onUpdateOpenHubId(params: Onboard.RoleAttributeParams[]): void {
    this.setSystemAttributes(RoleAttributeTypeEnum.OPEN_SUPPLY_HUB_ID, params);
  }

  onUpdateInternalId(params: Onboard.RoleAttributeParams[]): void {
    this.setSystemAttributes(
      RoleAttributeTypeEnum.INTERNAL_INDENTIFIER_SYSTEM,
      params,
    );
  }

  onUpdateAdditionalAttribute(params: Onboard.RoleAttributeParams[]): void {
    this.setSystemAttributes(
      RoleAttributeTypeEnum.ADDITIONAL_ATTRIBUTE,
      params,
    );
  }

  setSystemAttributes(
    type: RoleAttributeTypeEnum,
    params: Onboard.RoleAttributeParams[],
  ) {
    params.forEach((param) => {
      const index = this.systemAttributes[type].findIndex(
        ({ attributeId }) => attributeId === param.attributeId,
      );
      if (index > -1) {
        this.systemAttributes[type][index] = {
          ...this.systemAttributes[type][index],
          ...param,
        };
      }
    });
    this.validateSystemAttributes();
  }

  renderActions(isEdit: boolean, hasErrors: boolean): JSX.Element {
    const label = isEdit
      ? this.$t('common.action.save_changes')
      : this.$t('next');
    return (
      <Styled.Action>
        {isEdit && (
          <Button
            label={this.$t('common.action.cancel')}
            variant="transparentPrimary"
            click={() => {
              this.exit(false);
            }}
            disabled={this.isSubmitting}
          />
        )}
        <Button
          key={hasErrors}
          width="100%"
          type="submit"
          variant="primary"
          label={label}
          isLoading={this.isSubmitting}
          disabled={this.isDisabledSubmitButton || hasErrors}
        />
      </Styled.Action>
    );
  }

  renderOpenSupplyHub(isEdit: boolean): JSX.Element {
    if (this.hasOpenSupplyHub) {
      return (
        <OpenSupplyHub
          isEdit={isEdit}
          userInfo={this.userInfo}
          disabled={this.isSubmitting || isEdit || !auth.isFirstUser}
          messageErrors={this.OSIDMessageErrors}
          update={this.onUpdateOpenHubId}
          changeInput={this.onClearMessageErrors}
        />
      );
    }
  }

  renderCID(isEdit: boolean): JSX.Element {
    if (this.hasCID) {
      return (
        <CID
          isEdit={isEdit}
          userInfo={this.userInfo}
          disabled={this.isSubmitting || isEdit || !auth.isFirstUser}
          messageErrors={this.CIDMessageErrors}
          update={this.onUpdateCID}
          changeInput={this.onClearMessageErrors}
        />
      );
    }
  }

  renderInternalId(isEdit: boolean): JSX.Element {
    if (this.hasInternalId) {
      return (
        <InternalId
          isEdit={isEdit}
          userInfo={this.userInfo}
          disabled={this.isSubmitting || isEdit || !auth.isFirstUser}
          messageErrors={this.internalMessageErrors}
          update={this.onUpdateInternalId}
          changeInput={this.onClearMessageErrors}
        />
      );
    }
  }

  renderAdditionalAttribute(isEdit: boolean): JSX.Element {
    if (this.hasAdditionalAttribute) {
      return (
        <AdditionalAttribute
          column={isEdit ? 3 : 2}
          roleAttributes={this.roleAttributes}
          messageErrors={this.additionalAttributeMessageErrors}
          update={this.onUpdateAdditionalAttribute}
          changeInput={this.onClearMessageErrors}
        />
      );
    }
  }

  renderContact(isEdit: boolean): JSX.Element {
    return (
      <ContactProfile
        isEdit={isEdit}
        userInfo={this.userInfo}
        disabled={this.isSubmitting}
        messageErrors={this.userMessageErrors}
      />
    );
  }

  renderBusinessModel(isEdit: boolean): JSX.Element {
    return (
      <BusinessModel
        isEdit={isEdit}
        userInfo={this.userInfo}
        disabled={this.isSubmitting}
        isMassBalance={this.isMassBalance}
      />
    );
  }

  renderIdentifierSystem(isEdit: boolean): JSX.Element {
    return (
      <fragment>
        {this.roleAttributeOrderKeys.map((key: RoleAttributeTypeEnum) => {
          switch (key) {
            case RoleAttributeTypeEnum.OPEN_SUPPLY_HUB_ID:
              return this.renderOpenSupplyHub(isEdit);
            case RoleAttributeTypeEnum.RMI_CID:
              return this.renderCID(isEdit);
            case RoleAttributeTypeEnum.INTERNAL_INDENTIFIER_SYSTEM:
              return this.renderInternalId(isEdit);
          }
        })}
      </fragment>
    );
  }

  renderForm(isEdit: boolean = false): JSX.Element {
    return (
      <formulate-form
        v-model={this.formInput}
        name={this.formName}
        vOn:submit={this.onSubmit}
        scopedSlots={{
          default: ({ hasErrors }: { hasErrors: boolean }) => {
            return (
              <Styled.Form isEdit={isEdit}>
                {this.renderContact(isEdit)}
                {this.renderIdentifierSystem(isEdit)}
                {this.renderAdditionalAttribute(isEdit)}
                {this.renderBusinessModel(isEdit)}
                {this.renderActions(isEdit, hasErrors)}
              </Styled.Form>
            );
          },
        }}
      />
    );
  }
}
