import { Vue, Component, Prop } from 'vue-property-decorator';
import { getUserFacility } from 'utils/user';
import { getBusinessLocation } from 'utils/helpers';
import Button from 'components/FormUI/Button';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import { getUserInfo } from 'api/user-setting';
import * as Styled from './styled';
import EditProfile from '../EditProfile';

@Component
export default class MyProfile extends Vue {
  @Prop({
    default: () => {
      //TODO
    },
  })
  editProfile: () => void;

  private isEdit = false;
  private isLoading = true;
  private userInfo: Auth.User = null;

  get userFacility(): Auth.Facility {
    return getUserFacility(this.userInfo);
  }

  get businessLocation(): string {
    if (this.userFacility) {
      return getBusinessLocation(this.userFacility);
    }
    return '';
  }

  created() {
    this.initUserInfo();
  }

  toggleEdit(reload = false) {
    this.isEdit = !this.isEdit;
    if (!this.isEdit && reload) {
      this.initUserInfo();
    }
  }

  async initUserInfo(): Promise<void> {
    try {
      this.isLoading = true;
      const result = await getUserInfo();
      this.userInfo = result;
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  goToUserManagement() {
    this.$router.push({ name: 'LaborUserManagement' });
  }

  renderInfo(label: string, value: string): JSX.Element {
    return (
      <Styled.Info>
        <Styled.Label>{label}</Styled.Label>
        <text-direction>
          <Styled.Text>{value}</Styled.Text>
        </text-direction>
      </Styled.Info>
    );
  }

  renderContact(): JSX.Element {
    return (
      <Styled.Content>
        <Styled.Title>{this.$t('contact')}</Styled.Title>
        <Styled.Information>
          {this.renderInfo(this.$t('first_name'), this.userInfo.firstName)}
          {this.renderInfo(this.$t('last_name'), this.userInfo.lastName)}
          {this.renderInfo(this.$t('phone'), this.userInfo.phoneNumber)}
          {this.renderInfo(this.$t('email'), this.userInfo.email)}
        </Styled.Information>
      </Styled.Content>
    );
  }

  renderOrganization(): JSX.Element {
    if (this.userFacility) {
      return (
        <Styled.Content>
          <Styled.Title>{this.$t('organization_details')}</Styled.Title>
          <Styled.Information>
            {this.renderInfo(this.$t('name'), this.userFacility.name)}
            {this.renderInfo(
              this.$t('business_code'),
              this.userFacility.businessRegisterNumber,
            )}
            {this.renderInfo(this.$t('address'), this.businessLocation)}
          </Styled.Information>
        </Styled.Content>
      );
    }
    return null;
  }

  renderActions(): JSX.Element {
    return (
      <Styled.HeaderAction>
        <Styled.HeaderTitle>
          {this.$t('onboardPage.my_profile')}
        </Styled.HeaderTitle>
        {!this.isEdit && (
          <Button
            variant="primary"
            label={this.$t('edit_profile')}
            icon="edit"
            click={this.toggleEdit}
          />
        )}
      </Styled.HeaderAction>
    );
  }

  renderContent(): JSX.Element {
    if (this.isEdit) {
      return <EditProfile userInfo={this.userInfo} exit={this.toggleEdit} />;
    }
    return (
      <Styled.UserInfo>
        {this.renderContact()}
        {this.renderOrganization()}
      </Styled.UserInfo>
    );
  }

  render(): JSX.Element {
    if (this.isLoading) {
      return (
        <Styled.Loading>
          <SpinLoading />
        </Styled.Loading>
      );
    }
    return (
      <Styled.Wrapper>
        <Styled.Container>
          {this.renderActions()}
          {this.renderContent()}
        </Styled.Container>
      </Styled.Wrapper>
    );
  }
}
