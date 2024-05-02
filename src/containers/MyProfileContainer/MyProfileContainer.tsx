import { Vue, Component } from 'vue-property-decorator';
import { getUserInfo } from 'api/user-setting';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import Account from 'components/Account';
import ViewProfile from './elements/ViewProfile';
import EditProfile from './elements/EditProfile';
import * as Styled from './styled';

@Component
export default class MyProfileContainer extends Vue {
  private isEdit: boolean = false;
  private isLoading: boolean = false;
  private userInfo: Auth.User = null;

  created(): void {
    this.initUserInfo();
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

  toggleEdit(): void {
    this.isEdit = !this.isEdit;
  }

  onUpdated(): void {
    this.initUserInfo();
    this.toggleEdit();
  }

  renderContent(): JSX.Element {
    if (this.isEdit) {
      return (
        <EditProfile
          userInfo={this.userInfo}
          updated={this.onUpdated}
          cancel={this.toggleEdit}
        />
      );
    }
    return (
      <Styled.ViewProfile>
        <ViewProfile userInfo={this.userInfo} editProfile={this.toggleEdit} />
        <Account />
      </Styled.ViewProfile>
    );
  }

  render(): JSX.Element {
    return (
      <dashboard-layout>
        <Styled.Wrapper>
          {this.isLoading && <SpinLoading isInline={false} />}
          {!this.isLoading && (
            <fragment>
              <Styled.Title>{this.$t('myProfilePage.title')}</Styled.Title>
              {this.renderContent()}
            </fragment>
          )}
        </Styled.Wrapper>
      </dashboard-layout>
    );
  }
}
