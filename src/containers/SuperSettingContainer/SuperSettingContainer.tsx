import { Vue, Component } from 'vue-property-decorator';
import { SettingTabEnum } from 'enums/setting';
import Tabs from './elements/Tabs/Tabs';
import ProfileSetting from './elements/ProfileSetting/ProfileSetting';
import * as Styled from './styled';

@Component
export default class SettingContainer extends Vue {
  get tabs(): App.Tab[] {
    return [
      {
        icon: 'folder_simple_user',
        name: SettingTabEnum.SETUP_PROFILE,
        title: this.$t('account_details'),
        component: ProfileSetting,
      },
    ];
  }

  render(): JSX.Element {
    return (
      <dashboard-layout>
        <Styled.Wrapper>
          <Tabs
            tabs={this.tabs}
            scopedSlots={{
              tab: ({
                item: { component: TabComponent },
              }: {
                item: App.Tab;
              }) => <TabComponent />,
            }}
          />
        </Styled.Wrapper>
      </dashboard-layout>
    );
  }
}
