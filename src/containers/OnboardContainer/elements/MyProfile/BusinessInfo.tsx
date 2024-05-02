import { Vue, Component, Prop } from 'vue-property-decorator';
import { getUserRole } from 'utils/user';
import { checkOarId } from 'api/onboard';
import Input from 'components/FormUI/Input';
import { handleError } from 'components/Toast';
import MessageError from 'components/FormUI/MessageError';
import { SpinLoading } from 'components/Loaders';
import OarInfo from './OarInfo';
import * as Styled from './styled';

const RegisterOarIdModal = () => import('modals/RegisterOarIdModal');

@Component
export default class BusinessInfo extends Vue {
  @Prop({ required: true }) readonly userInfo: Auth.User;
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop({
    default: () => {
      //
    },
  })
  changeInput: () => void;

  private isLoading: boolean = false;
  private oarIdError: string = null;
  private isMatched: boolean = false;
  private hasSearch: boolean = false;
  private oarIdDetail: Onboard.OarIdDetail = null;

  get formName(): string {
    return this.$formulate.registry.keys().next().value;
  }

  get formData(): Onboard.ProfileRequestParams {
    return this.$formulate.registry.get(this.formName).proxy;
  }

  get userRole(): RoleAndPermission.Role {
    return getUserRole(this.userInfo);
  }

  get oarId(): string {
    return this.formData.oarId;
  }

  set oarId(value: string) {
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      oarId: value,
    });
  }

  get businessRegisterNumber(): string {
    return this.formData.businessRegisterNumber;
  }

  set businessRegisterNumber(value: string) {
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      businessRegisterNumber: value,
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

  created(): void {
    this.initBusinessInfo();
  }

  initBusinessInfo(): void {
    const { currentFacility } = this.userInfo;
    this.businessRegisterNumber = currentFacility.businessRegisterNumber;
    if (currentFacility.oarId) {
      const { name, oarId, countryId, provinceId, districtId, address } =
        currentFacility;
      this.hasSearch = true;
      this.changeOarId({
        isMatched: true,
        name,
        oarId,
        countryId,
        provinceId,
        districtId,
        address,
      });
    }
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
    this.$modal.show(
      RegisterOarIdModal,
      {
        onSuccess: this.onRegisterOarIdSuccess,
      },
      { width: '776px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  onRegisterOarIdSuccess(oarDetail: Onboard.OarIdDetail): void {
    this.oarIdError = null;
    this.hasSearch = false;
    this.changeInput();
    this.changeOarId({ isMatched: true, ...oarDetail });
  }

  renderBusinessNumber(): JSX.Element {
    return (
      <Styled.Column>
        <Input
          height="48px"
          variant="material"
          label={this.$t('business_code')}
          name="businessRegisterNumber"
          placeholder={this.$t('business_code')}
          validation="bail|required"
          disabled={this.disabled}
          changeValue={this.changeInput}
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('business_code').toLowerCase(),
            }),
          }}
        />
        {this.messageErrors && (
          <MessageError
            field="businessRegisterNumber"
            messageErrors={this.messageErrors}
          />
        )}
      </Styled.Column>
    );
  }

  renderOarId(): JSX.Element {
    return (
      <Styled.Column>
        <Input
          height="48px"
          variant="material"
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
          <MessageError field="oarId" messageErrors={this.messageErrors} />
        )}
      </Styled.Column>
    );
  }

  renderBusinessInfo(): JSX.Element {
    return (
      <fragment>
        {this.renderBusinessNumber()}
        {this.renderOarId()}
      </fragment>
    );
  }

  renderOarIdInfo(): JSX.Element {
    if (this.isMatched) {
      return (
        <OarInfo
          key={this.oarIdDetail.oarId}
          data={this.oarIdDetail}
          messageErrors={this.messageErrors}
        />
      );
    }
    return null;
  }

  render(): JSX.Element {
    return (
      <Styled.Group>
        <Styled.SubTitle>{this.$t('information')}</Styled.SubTitle>
        <Styled.BusinessInformation>
          {this.isLoading && <SpinLoading isInline={false} />}
          {this.renderBusinessInfo()}
        </Styled.BusinessInformation>
        {this.renderOarIdInfo()}
      </Styled.Group>
    );
  }
}
