import { Vue, Component, Prop } from 'vue-property-decorator';
import { filter, isEmpty } from 'lodash';
import { MyProfileTabEnum } from 'enums/user';
import Tabs from 'components/Tabs';
import auth from 'store/modules/auth';
import * as Styled from './styled';
import ViewProfile from '../ViewProfile';
import ProducerManagement from '../ProducerManagement';
import SAQTab from '../SAQTab';

@Component
export default class MyProfileTabs extends Vue {
  @Prop({
    default: () => {
      // TODO
    },
  })
  updateShowAccount: (isShow: boolean) => void;

  get tabs(): App.Tab[] {
    const tabs = [
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
      auth.hasRequireSAQ && auth.uploadedSAQ
        ? {
            name: MyProfileTabEnum.SAQ,
            title: this.$t(
              'myProfilePage.start_new_self_assessment_questionnaire',
            ),
            component: SAQTab,
          }
        : null,
    ];
    return filter(tabs, (tab) => !isEmpty(tab));
  }

  created() {
    this.handleChangeTab();
  }

  handleChangeTab(index: number = 0) {
    const isShowAccount = this.tabs[index].name === MyProfileTabEnum.MY_PROFILE;
    this.updateShowAccount(isShowAccount);
  }

  onFinishSAQ() {
    (this.$refs.myProfileTab as Tabs).activeTab = 0;
  }

  renderTabs(): JSX.Element {
    return (
      <Tabs
        ref="myProfileTab"
        tabs={this.tabs}
        scopedSlots={{
          tab: ({ item }: { item: App.Tab }) => {
            const TabComponent = item.component;
            if (item.name === MyProfileTabEnum.SAQ) {
              return <TabComponent finishSAQ={this.onFinishSAQ} />;
            }
            return <TabComponent />;
          },
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
