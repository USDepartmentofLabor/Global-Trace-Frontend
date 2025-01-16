/* eslint-disable max-lines */
import { Vue, Component, Prop } from 'vue-property-decorator';
import { get, head, isEmpty } from 'lodash';
import { getUserRole } from 'utils/user';
import { checkOarId } from 'api/onboard';
import Input from 'components/FormUI/Input';
import { handleError } from 'components/Toast';
import { OSIDAttributesEnum, RoleAttributeTypeEnum } from 'enums/role';
import MessageError from 'components/FormUI/MessageError';
import { SpinLoading } from 'components/Loaders';
import OpenSupplyHubInfo from './OpenSupplyHubInfo';
import * as Styled from './styled';

const RegisterOarIdModal = () => import('modals/RegisterOarIdModal');

@Component
export default class OpenSupplyHub extends Vue {
  @Prop({ default: false }) readonly isEdit: boolean;
  @Prop({ required: true }) readonly userInfo: Auth.User;
  @Prop({ default: null }) readonly messageErrors: App.MessageError[];
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop({
    default: () => {
      //
    },
  })
  changeInput: () => void;
  @Prop({
    default: () => {
      //
    },
  })
  update: (params: Onboard.RoleAttributeParams[]) => void;

  private isLoading: boolean = false;
  private oarIdError: string = null;
  private isMatched: boolean = false;
  private hasSearch: boolean = false;
  private oarIdDetail: Onboard.OarIdDetail = null;
  private formName: string = 'openSupplyHub';
  private formInput: Onboard.OsIDParams = {
    businessName: '',
    oarId: '',
    countryId: '',
    provinceId: '',
    districtId: '',
    address: '',
  };

  get userRole(): RoleAndPermission.Role {
    return getUserRole(this.userInfo);
  }

  get oarId(): string {
    return this.formInput.oarId;
  }

  set oarId(value: string) {
    this.$formulate.setValues(this.formName, {
      ...this.formInput,
      oarId: value,
    });
  }

  get suffixIcon(): string {
    if (!this.hasSearch || this.isLoading) {
      return 'search';
    }
    return this.isMatched ? 'circle_check' : 'circle_warning';
  }

  get iconColor(): string {
    if (!this.hasSearch || this.isLoading) {
      return 'spunPearl';
    }
    return this.isMatched ? 'highland' : 'red';
  }

  get roleAttributes(): Auth.RoleAttribute[] {
    const { roleAttributes } = this.userInfo;
    return roleAttributes[RoleAttributeTypeEnum.OPEN_SUPPLY_HUB_ID];
  }

  get oarIdAttribute(): Auth.RoleAttribute {
    return this.getAttribute(OSIDAttributesEnum.OS_ID);
  }

  get nameAttribute(): Auth.RoleAttribute {
    return this.getAttribute(OSIDAttributesEnum.BUSINESS_NAME);
  }

  get countryAttribute(): Auth.RoleAttribute {
    return this.getAttribute(OSIDAttributesEnum.COUNTRY);
  }

  get provinceAttribute(): Auth.RoleAttribute {
    return this.getAttribute(OSIDAttributesEnum.PROVINCE);
  }

  get districtAttribute(): Auth.RoleAttribute {
    return this.getAttribute(OSIDAttributesEnum.DISTRICT);
  }

  get addressAttribute(): Auth.RoleAttribute {
    return this.getAttribute(OSIDAttributesEnum.ADDRESS);
  }

  get oarIdErrors(): App.MessageError {
    return get(head(this.messageErrors), 'children');
  }

  initData(): void {
    const oarId = get(this.oarIdAttribute, 'value');
    if (!isEmpty(this.roleAttributes) && !isEmpty(oarId)) {
      this.hasSearch = true;
      this.changeOarId({
        oarId,
        name: get(this.nameAttribute, 'value', ''),
        countryId: get(this.countryAttribute, 'value', ''),
        provinceId: get(this.provinceAttribute, 'value', ''),
        districtId: get(this.districtAttribute, 'value', ''),
        address: get(this.addressAttribute, 'value', ''),
        isMatched: true,
      });
    }
  }

  getAttribute(attributeName: OSIDAttributesEnum): Auth.RoleAttribute {
    return this.roleAttributes.find(
      ({ attribute }) => attribute.name === attributeName,
    );
  }

  async checkOarId(search: string): Promise<void> {
    try {
      this.isLoading = true;
      const params: Onboard.CheckOarIdParams = {
        oarId: search,
        page: 1,
        pageSize: 10,
      };
      const response = await checkOarId(params);
      if (response.isMatched) {
        const oarId = search;
        this.oarId = oarId;
        this.onCheckSuccess(response);
      } else {
        this.onCheckFail();
      }
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  onChangeOarId(value: string): void {
    this.oarIdError = null;
    this.hasSearch = false;
    this.oarId = value;
    this.changeInput();
  }

  changeOarId(oarIdDetail: Onboard.OarIdDetail): void {
    const { isMatched, oarId } = oarIdDetail;
    this.oarId = oarId;
    this.isMatched = isMatched;
    this.oarIdDetail = oarIdDetail;
  }

  onCheckSuccess(detail: Onboard.OarIdDetail): void {
    this.oarIdError = null;
    this.changeOarId({ ...detail, oarId: this.oarId });
    this.updateOarIDAttribute();
  }

  onCheckFail(): void {
    this.oarIdError = this.$t('registerOsIdModal.os_id_not_exist');
    const params = {
      isMatched: false,
      oarId: this.oarId,
      name: '',
      countryId: '',
      provinceId: '',
      districtId: '',
      address: '',
    };
    this.changeOarId(params);
  }

  onCheckOarId(): void {
    if (!this.hasSearch) {
      this.changeInput();
      this.checkOarId(this.oarId);
    }
    this.hasSearch = true;
  }

  openRegisterOarIdModal(): void {
    if (!this.disabled) {
      this.$modal.show(
        RegisterOarIdModal,
        {
          onSuccess: this.onRegisterOarIdSuccess,
        },
        { width: '776px', height: 'auto', clickToClose: false, adaptive: true },
      );
    }
  }

  onRegisterOarIdSuccess(oarDetail: Onboard.OarIdDetail): void {
    this.oarIdError = null;
    this.hasSearch = false;
    this.changeInput();
    this.changeOarId({ isMatched: true, ...oarDetail });
    this.updateOarIDAttribute();
  }

  updateOarIDAttribute() {
    this.update([
      {
        attributeId: this.oarIdDetail.oarIdAttributeId,
        value: this.oarIdDetail.oarId,
        roleAttributeType: RoleAttributeTypeEnum.OPEN_SUPPLY_HUB_ID,
      },
      {
        attributeId: this.oarIdDetail.nameAttributeId,
        value: this.oarIdDetail.name,
        roleAttributeType: RoleAttributeTypeEnum.OPEN_SUPPLY_HUB_ID,
      },
      {
        attributeId: this.oarIdDetail.countryIdAttributeId,
        value: this.oarIdDetail.countryId,
        roleAttributeType: RoleAttributeTypeEnum.OPEN_SUPPLY_HUB_ID,
      },
      {
        attributeId: this.oarIdDetail.provinceIdAttributeId,
        value: this.oarIdDetail.provinceId,
        roleAttributeType: RoleAttributeTypeEnum.OPEN_SUPPLY_HUB_ID,
      },
      {
        attributeId: this.oarIdDetail.districtIdAttributeId,
        value: this.oarIdDetail.districtId || this.formInput.districtId,
        roleAttributeType: RoleAttributeTypeEnum.OPEN_SUPPLY_HUB_ID,
      },
      {
        attributeId: this.oarIdDetail.addressAttributeId,
        value: this.oarIdDetail.address,
        roleAttributeType: RoleAttributeTypeEnum.OPEN_SUPPLY_HUB_ID,
      },
    ]);
  }

  mounted() {
    this.initData();
  }

  renderOarId(): JSX.Element {
    return (
      <Styled.Column>
        <Input
          height="48px"
          label={this.$t('os_id')}
          name="oarId"
          placeholder={this.$t('os_id')}
          validation="bail|required"
          disabled={this.disabled || this.isLoading}
          changeValue={this.onChangeOarId}
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('os_id').toLowerCase(),
            }),
          }}
          iconSize="24"
          suffixIcon={this.suffixIcon}
          iconColor={this.iconColor}
          clickSuffixIcon={this.onCheckOarId}
        />
        <Styled.Text>
          {this.oarIdError && (
            <Styled.ErrorMessage>{this.oarIdError}</Styled.ErrorMessage>
          )}
          {!this.oarIdError && this.$t('onboardPage.did_not_have_one')}
          <Styled.Link vOn:click={this.openRegisterOarIdModal}>
            {this.$t('onboardPage.click_here_to_create')}
          </Styled.Link>
        </Styled.Text>
        {this.messageErrors && (
          <MessageError
            field={this.oarIdAttribute.attributeId}
            messageErrors={this.messageErrors}
          />
        )}
      </Styled.Column>
    );
  }

  renderOarIdInfo(): JSX.Element {
    if (this.isMatched) {
      return (
        <OpenSupplyHubInfo
          userInfo={this.userInfo}
          formName={this.formName}
          key={this.oarIdDetail.oarId}
          data={this.oarIdDetail}
          messageErrors={this.messageErrors}
          changeInput={this.updateOarIDAttribute}
        />
      );
    }
    return null;
  }

  render(): JSX.Element {
    return (
      <Styled.Group>
        {this.isLoading && <SpinLoading isInline={false} />}
        <Styled.SubTitle>{this.$t('open_supply_hub_id')}</Styled.SubTitle>
        <formulate-form
          v-model={this.formInput}
          name={this.formName}
          scopedSlots={{
            default: () => {
              return (
                <Styled.BusinessInformation column={this.isEdit ? 3 : 2}>
                  {this.renderOarId()}
                  {this.renderOarIdInfo()}
                </Styled.BusinessInformation>
              );
            },
          }}
        />
      </Styled.Group>
    );
  }
}
