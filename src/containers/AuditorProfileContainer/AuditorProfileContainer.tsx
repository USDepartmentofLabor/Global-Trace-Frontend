import { Vue, Component } from 'vue-property-decorator';
import { getUserInfo } from 'api/user-setting';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import Account from 'components/Account';
import EditProfile from './elements/EditProfile';
import MyProfile from './elements/MyProfile';
import * as Styled from './styled';

@Component
export default class AuditorProfileContainer extends Vue {
  private isLoading: boolean = false;
  private isEdit: boolean = false;
  private userInfo: Auth.User = null;

  created(): void {
    this.getUserInfo();
  }

  async getUserInfo(): Promise<void> {
    try {
      this.isLoading = true;
      const userInfo = await getUserInfo();
      this.userInfo = userInfo;
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
    this.getUserInfo();
    this.toggleEdit();
  }

  renderContent(): JSX.Element {
    return this.isEdit ? (
      <EditProfile userInfo={this.userInfo} updated={this.onUpdated} />
    ) : (
      <Styled.ViewProfile>
        <MyProfile userInfo={this.userInfo} editProfile={this.toggleEdit} />{' '}
        <Account />
      </Styled.ViewProfile>
    );
  }

  render(): JSX.Element {
    return (
      <dashboard-layout headerStroke>
        <Styled.Wrapper>
          <Styled.Container>
            {this.isLoading && <SpinLoading isInline={false} />}
            {!this.isLoading && this.renderContent()}
          </Styled.Container>
        </Styled.Wrapper>
      </dashboard-layout>
    );
  }
}
