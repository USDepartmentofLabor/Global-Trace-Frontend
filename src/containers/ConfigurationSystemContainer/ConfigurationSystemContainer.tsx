/* eslint-disable  max-lines-per-function */
import { Vue, Component, Ref } from 'vue-property-decorator';
import { SettingTabEnum } from 'enums/setting';
import Tabs from './elements/ConfigurationTabs/ConfigurationTabs';
import Taxonomy from './elements/TaxonomyExploitation/TaxonomyExploitation';
import RoleAndPermission from './elements/RoleAndPermission/RoleAndPermission';
import SupplyChainMapping from './elements/SupplyChainMapping/SupplyChainMapping';
import AddProduct from './elements/AddProduct/AddProduct';
import SiteSetting from './elements/SiteSetting/SiteSetting';
import ConfigurableSAQ from './elements/ConfigurableSAQ/ConfigurableSAQ';
import RiskAssessment from './elements/RiskAssessment/RiskAssessment';
import Preview from './elements/Preview/Preview';
import * as Styled from './styled';

@Component
export default class SettingContainer extends Vue {
  @Ref('configurationTab')
  readonly configurationTab!: Tabs;
  private enableIndex: number = 5;

  get tabs(): App.Tab[] {
    return [
      {
        icon: 'folder_simple_user',
        name: SettingTabEnum.SETUP_PROFILE,
        title: this.$t('set_up_profile'),
        component: SiteSetting,
      },
      {
        icon: 'frame_corner',
        name: SettingTabEnum.ADD_PRODUCT,
        title: this.$t('add_product'),
        component: AddProduct,
      },
      {
        icon: 'user_circle_gear',
        name: SettingTabEnum.ROLE_PERMISSION,
        title: this.$t('roles_and_permissions'),
        component: RoleAndPermission,
      },
      {
        icon: 'flow_arrow',
        name: SettingTabEnum.SUPPLY_CHAIN_MAPPING,
        title: this.$t('supply_chain_mapping'),
        component: SupplyChainMapping,
      },
      {
        icon: 'atom',
        name: SettingTabEnum.TAXONOMY_OF_EXPLOITATION,
        title: this.$t('indicator_list'),
        component: Taxonomy,
      },
      {
        icon: 'clipboard_text',
        name: SettingTabEnum.CONFIGURABLE_SAQ,
        title: this.$t('assessment'),
        component: ConfigurableSAQ,
      },
      {
        icon: 'bezier_curve',
        name: SettingTabEnum.RISK_ASSESSMENT,
        title: this.$t('risk_assessment'),
        component: RiskAssessment,
      },
      {
        icon: 'shield_check',
        name: SettingTabEnum.PREVIEW,
        title: this.$t('preview'),
        component: Preview,
      },
    ];
  }

  ready(tabName: SettingTabEnum): void {
    const currentTabIndex = this.tabs.findIndex(({ name }) => name === tabName);
    if (currentTabIndex > -1 && currentTabIndex < this.tabs.length) {
      this.enableIndex++;
    }
  }

  finish(tabName: SettingTabEnum): void {
    const currentTabIndex = this.tabs.findIndex(({ name }) => name === tabName);
    if (currentTabIndex > -1 && currentTabIndex < this.tabs.length) {
      this.configurationTab.changeTab(currentTabIndex + 1);
    }
  }

  render(): JSX.Element {
    return (
      <dashboard-layout>
        <Styled.Wrapper>
          <Tabs
            ref="configurationTab"
            tabs={this.tabs}
            enableIndex={this.enableIndex}
            scopedSlots={{
              tab: ({
                item: { component: TabComponent },
              }: {
                item: App.Tab;
              }) => <TabComponent ready={this.ready} finish={this.finish} />,
            }}
          />
        </Styled.Wrapper>
      </dashboard-layout>
    );
  }
}
