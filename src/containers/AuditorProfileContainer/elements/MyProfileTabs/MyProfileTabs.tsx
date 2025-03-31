import { Vue, Component, Prop } from 'vue-property-decorator';
import { MyProfileTabEnum } from 'enums/user';
import Tabs from 'components/Tabs';
import auth from 'store/modules/auth';
import ProducerManagement from 'containers/MyProfileContainer/elements/ProducerManagement';
import * as Styled from './styled';
import ViewProfile from '../ViewProfile';

@Component
export default class MyProfileTabs extends Vue {
  @Prop({
    default: () => {
      // TODO
    },
  })
  updateShowAccount: (isShow: boolean) => void;
  @Prop({
    default: () => {
      // TODO
    },
  })
  exit: () => void;

  get tabs(): App.Tab[] {
    return [
      {
        name: MyProfileTabEnum.MY_PROFILE,
        title: this.$t('onboardPage.my_profile'),
        component: ViewProfile,
      },
      {
        name: MyProfileTabEnum.USER_MANAGEMENT,
        title: this.$t('sidebar.user_management'),
        component: ProducerManagement,
      },
    ];
  }

  created() {
    this.handleChangeTab();
  }

  handleChangeTab(index: number = 0) {
    const isShowAccount = this.tabs[index].name === MyProfileTabEnum.MY_PROFILE;
    this.updateShowAccount(isShowAccount);
  }

  renderTabs(): JSX.Element {
    return (
      <Tabs
        ref="myProfileTab"
        tabs={this.tabs}
        scopedSlots={{
          tab: ({ item: { component: TabComponent } }: { item: App.Tab }) => (
            <TabComponent exit={this.exit} />
          ),
        }}
        changeTab={this.handleChangeTab}
      />
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Container>
        {auth.isAdminType && this.renderTabs()}
        {!auth.isAdminType && <ViewProfile />}
      </Styled.Container>
    );
  }
}
