import { Vue, Component } from 'vue-property-decorator';
import Account from 'components/Account';
import MyProfileTabs from './elements/MyProfileTabs';
import * as Styled from './styled';

@Component
export default class MyProfileContainer extends Vue {
  private showAccount: boolean = true;

  setShowAccount(showAccount: boolean) {
    this.showAccount = showAccount;
  }

  render(): JSX.Element {
    return (
      <dashboard-layout>
        <Styled.Wrapper>
          <Styled.ViewProfile>
            <MyProfileTabs updateShowAccount={this.setShowAccount} />
            {this.showAccount && <Account />}
          </Styled.ViewProfile>
        </Styled.Wrapper>
      </dashboard-layout>
    );
  }
}
