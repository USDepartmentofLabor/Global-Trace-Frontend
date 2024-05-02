/* eslint-disable max-lines, max-lines-per-function */
import { Component, Prop, Vue } from 'vue-property-decorator';
import moment from 'moment';
import {
  filter,
  get,
  isEmpty,
  isNull,
  reduce,
  pick,
  values,
  map,
  cloneDeep,
} from 'lodash';
import {
  getPermissions,
  createRole,
  editRole,
  validateRoles,
} from 'api/permission';
import {
  RoleTypeEnum,
  ChainOfCustodyEnum,
  GroupTypeEnum,
  PermissionActionEnum,
} from 'enums/role';
import { handleError } from 'components/Toast';
import { DATE_FORMAT } from 'config/constants';
import { YesNoEnum } from 'enums/brand';
import Button from 'components/FormUI/Button';
import RadioGroup from 'components/FormUI/Radio/RadioGroup';
import { SpinLoading } from 'components/Loaders';
import Info from './elements/Info';
import PermissionsList from './elements/PermissionsList';
import ChainOfCustody from './elements/ChainOfCustody';
import Season from './elements/Season';
import * as Styled from './styled';

@Component
export default class RoleModal extends Vue {
  @Prop({ default: null })
  readonly role: RoleAndPermission.Role;
  @Prop({
    default: () => {
      //
    },
  })
  onSuccess: () => void;

  private isLoading: boolean = false;
  private isSubmitting: boolean = false;
  private isUpdatePermission: boolean = false;
  private formName = 'roleForm';
  private seasonStartDate: Date = null;
  private seasonDuration: number = null;
  private chainOfCustody: ChainOfCustodyEnum = null;
  private rawMaterialExtractor: YesNoEnum = YesNoEnum.NO;
  private formInput: RoleAndPermission.RoleParams = {
    isRawMaterialExtractor: false,
    seasonStartDate: '',
    seasonDuration: null,
    name: '',
    type: null,
    chainOfCustody: null,
    assignedPermissionIds: [],
  };
  private messageErrors: App.MessageError = null;
  private permissions: RoleAndPermission.NewPermission[] = [];
  private initPermissions: RoleAndPermission.NewPermission[] = [];
  private rawOptions: App.Radio[] = [
    { label: this.$t('yes'), value: YesNoEnum.YES },
    {
      label: this.$t('no'),
      value: YesNoEnum.NO,
    },
  ];

  private isProductType: boolean = false;

  get isEdit(): boolean {
    return !isNull(this.role);
  }

  get messageSuccess(): string {
    return this.isEdit ? 'updated_role_successfully' : 'add_success';
  }

  get isValidRaw(): boolean {
    if (!this.isProductType) {
      return true;
    }
    if (this.rawMaterialExtractor === YesNoEnum.YES) {
      return !isNull(this.seasonStartDate) && !isNull(this.seasonDuration);
    }
    return !isEmpty(this.formInput.chainOfCustody);
  }

  get isDisabled(): boolean {
    return isEmpty(this.formInput.assignedPermissionIds) || !this.isValidRaw;
  }

  get title(): string {
    if (this.isEdit) {
      return this.$t('edit_role');
    }
    return this.$t('add_new_role');
  }

  created(): void {
    this.initData();
  }

  async initData(): Promise<void> {
    if (this.role) {
      const {
        name,
        type,
        permissions,
        isRawMaterialExtractor,
        seasonDuration,
        seasonStartDate,
        chainOfCustody,
      } = this.role;
      this.formInput.name = name;
      this.formInput.type = type;
      await this.handleChangeType(type);
      this.handleChangeFormPermissions(permissions);
      if (type === RoleTypeEnum.PRODUCT) {
        this.onChangeRaw(isRawMaterialExtractor ? YesNoEnum.YES : YesNoEnum.NO);
        if (isRawMaterialExtractor) {
          this.changeSeasonStartDate(
            moment(seasonStartDate, DATE_FORMAT).format(),
          );
          this.changeSeasonDuration(seasonDuration);
        } else {
          this.onChangeChainOfCustody(chainOfCustody);
        }
      }
    }
  }

  handleChangeFormPermissions(
    permissions: RoleAndPermission.Permission[],
  ): void {
    const assignedIds = reduce(
      permissions,
      function (ids, permission) {
        const subPermissionIds = map(
          get(permission, 'subPermissions', []),
          'id',
        );
        const selectedIds = [permission.id, ...subPermissionIds];
        return [...ids, ...selectedIds];
      },
      [],
    );
    this.onChangePermissionIds(assignedIds);
  }

  async handleChangeType(type: RoleTypeEnum): Promise<void> {
    this.isProductType = type === RoleTypeEnum.PRODUCT;
    await this.getPermissions(type);
    if (this.isProductType) {
      this.filterPermissions();
    }
    this.resetProductForm();
  }

  resetProductForm() {
    this.onChangeRaw(YesNoEnum.NO);
    this.changeSeasonStartDate();
    this.changeSeasonDuration();
    this.onChangeChainOfCustody();
  }

  async getPermissions(type: RoleTypeEnum): Promise<void> {
    this.isLoading = true;
    try {
      let permissions = await getPermissions({ roleType: type });
      if (type === RoleTypeEnum.ADMINISTRATOR) {
        permissions = this.updateAdministratorPermissions(permissions);
      }
      this.permissions = permissions;
      this.initPermissions = cloneDeep(permissions);
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  updateAdministratorPermissions(
    permissions: RoleAndPermission.NewPermission[],
  ): RoleAndPermission.NewPermission[] {
    if (!isEmpty(permissions)) {
      permissions[0].groupType = GroupTypeEnum.CHECKBOX;
    }
    return permissions;
  }

  async validateConfigRole(): Promise<boolean> {
    try {
      const params: RoleAndPermission.RoleValidateParams = {
        id: this.isEdit ? this.role.id : null,
        name: this.formInput.name,
      };
      await validateRoles(params);
      return true;
    } catch (error) {
      this.messageErrors = get(error, 'errors');
      return false;
    }
  }

  async onConfigRole(): Promise<void> {
    try {
      this.isSubmitting = true;
      this.formInput.assignedPermissionIds = filter(
        this.formInput.assignedPermissionIds,
        (id: string) => !isNull(id),
      );
      const payload = pick(this.formInput, [
        'name',
        'type',
        'chainOfCustody',
        'assignedPermissionIds',
        'isRawMaterialExtractor',
        'seasonStartDate',
        'seasonDuration',
      ]);
      payload.isRawMaterialExtractor =
        this.rawMaterialExtractor === YesNoEnum.YES;
      if (this.isEdit) {
        await editRole(this.role.id, payload);
      } else {
        await createRole(payload);
      }
      this.onSuccess();
      this.$toast.success(this.$t(this.messageSuccess));
      this.closeModal();
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

  async onSubmit(): Promise<void> {
    const isValid = await this.validateConfigRole();
    if (isValid) {
      this.onConfigRole();
    }
  }

  onCancel(): void {
    this.closeModal();
  }

  closeModal(): void {
    this.$emit('close');
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  onChangeChainOfCustody(value: ChainOfCustodyEnum = null): void {
    this.chainOfCustody = value;
    this.$formulate.setValues(this.formName, {
      ...this.formInput,
      chainOfCustody: value,
    });
    this.filterPermissions();
  }

  filterPermissions() {
    this.isUpdatePermission = true;
    this.$nextTick(() => {
      if (
        this.rawMaterialExtractor === YesNoEnum.YES ||
        isEmpty(this.formInput.chainOfCustody) ||
        this.formInput.chainOfCustody === ChainOfCustodyEnum.PRODUCT_SEGREGATION
      ) {
        this.hideSubPermissions([PermissionActionEnum.VIEW_MARGIN_OF_ERROR]);
      } else {
        this.permissions = cloneDeep(this.initPermissions);
      }
      this.isUpdatePermission = false;
    });
  }

  hideSubPermissions(permissionActions: PermissionActionEnum[]) {
    this.permissions = cloneDeep(this.initPermissions).map(
      (permissionGroup) => {
        const ignoreSubPermissions = permissionGroup.subPermissions.filter(
          ({ action }) => permissionActions.includes(action),
        );
        if (!isEmpty(ignoreSubPermissions)) {
          this.formInput.assignedPermissionIds =
            this.formInput.assignedPermissionIds.filter((id) =>
              ignoreSubPermissions.some((permission) => permission.id !== id),
            );
          permissionGroup.subPermissions =
            permissionGroup.subPermissions.filter(({ action }) =>
              ignoreSubPermissions.some(
                (permission) => permission.action !== action,
              ),
            );
        }
        return permissionGroup;
      },
    );
  }

  onChangePermissionIds(values: string[]): void {
    this.formInput.assignedPermissionIds = values;
  }

  onChangeRaw(value: YesNoEnum = null) {
    this.rawMaterialExtractor = value;
    this.$formulate.setValues(this.formName, {
      ...this.formInput,
      isRawMaterialExtractor: value,
    });
    this.filterPermissions();
  }

  changeSeasonStartDate(value: string = null) {
    this.seasonStartDate = value ? moment(value).toDate() : null;
    this.$formulate.setValues(this.formName, {
      ...this.formInput,
      seasonStartDate: value ? moment(value).format(DATE_FORMAT) : null,
    });
  }

  changeSeasonDuration(value: number = null) {
    this.seasonDuration = value;
    this.$formulate.setValues(this.formName, {
      ...this.formInput,
      seasonDuration: value,
    });
  }

  renderRaw(): JSX.Element {
    return (
      <Styled.Raw>
        <Styled.Title>{this.$t('raw_material_extractor')}</Styled.Title>
        <RadioGroup
          name="isRawMaterialExtractor"
          value={this.rawMaterialExtractor}
          changeValue={this.onChangeRaw}
          options={this.rawOptions}
        />
      </Styled.Raw>
    );
  }

  renderForm(): JSX.Element {
    return (
      <formulate-form
        v-model={this.formInput}
        name={this.formName}
        scopedSlots={{
          default: ({ hasErrors }: { hasErrors: boolean }) => (
            <Styled.FormContainer>
              <Info
                formName={this.formName}
                isEdit={this.isEdit}
                messageErrors={this.messageErrors}
                changeInput={this.onClearMessageErrors}
                changeType={this.handleChangeType}
              />
              {this.isLoading && <SpinLoading />}
              {!this.isLoading && (
                <perfect-scrollbar>
                  <Styled.Content>
                    {this.isProductType && (
                      <fragment>
                        {this.renderRaw()}
                        {this.rawMaterialExtractor === YesNoEnum.YES && (
                          <Season
                            isSubmitting={this.isSubmitting}
                            seasonStartDate={this.seasonStartDate}
                            seasonDuration={this.seasonDuration}
                            changeStartDate={this.changeSeasonStartDate}
                            changeDuration={this.changeSeasonDuration}
                          />
                        )}
                        {this.rawMaterialExtractor === YesNoEnum.NO && (
                          <ChainOfCustody
                            formName={this.formName}
                            value={this.chainOfCustody}
                            change={this.onChangeChainOfCustody}
                          />
                        )}
                      </fragment>
                    )}
                    {!isEmpty(this.permissions) && !this.isUpdatePermission && (
                      <PermissionsList
                        isEdit={this.isEdit}
                        defaultValues={this.formInput.assignedPermissionIds}
                        permissions={this.permissions}
                        change={this.onChangePermissionIds}
                      />
                    )}
                  </Styled.Content>
                </perfect-scrollbar>
              )}
              {this.renderActions(hasErrors)}
            </Styled.FormContainer>
          ),
        }}
        vOn:submit={this.onSubmit}
      />
    );
  }

  renderActions(hasError: boolean): JSX.Element {
    return (
      <Styled.Actions>
        <Button
          label={this.$t('common.action.cancel')}
          variant="outlinePrimary"
          width="180px"
          click={this.onCancel}
        />
        <Button
          type="submit"
          variant="primary"
          label={this.isEdit ? this.$t('save') : this.$t('add')}
          isLoading={this.isSubmitting}
          disabled={this.isSubmitting || this.isDisabled || hasError}
          width="180px"
        />
      </Styled.Actions>
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout showCloseIcon={false} title={this.title}>
        <Styled.Wrapper>{this.renderForm()}</Styled.Wrapper>
      </modal-layout>
    );
  }
}
