import { Vue, Component, Prop } from 'vue-property-decorator';
import { get, map, isEmpty } from 'lodash';
import resources from 'config/resources';
import { getCategoryIcons } from 'utils/category-icon-helper';
import { getCategoryName } from 'utils/translation';
import * as Styled from './styled';
import TabInformation from '../TabInformation/TabInformation';

@Component
export default class InformationDetail extends Vue {
  @Prop({ required: true })
  readonly facility: Auth.Facility;
  @Prop({ required: true }) readonly sourceData: Auth.SupplierData[];
  @Prop({ default: '' }) private currentCategoryId: string;
  @Prop({ default: '' }) private currentIndicatorId: string;
  @Prop({ default: '' }) private currentSubIndicatorId: string;
  @Prop({ default: null }) private topIssue: Auth.TopIssue;
  @Prop({
    default: () => {
      // TODO
    },
  })
  setCurrentRisk: (
    categoryId: string,
    indicatorId: string,
    subIndicatorId: string,
  ) => void;
  @Prop({
    default: () => {
      // TODO
    },
  })
  addedCAP: (reload: boolean) => void;

  private activeTab: number = 0;

  get resourceIcons(): App.DropdownOption[] {
    return getCategoryIcons();
  }

  get tabs(): App.Tab[] {
    return this.sourceData.map((item) => ({
      name: get(item, 'category.id', ''),
      title: getCategoryName(
        get(item, 'category.name', ''),
        get(item, 'category.translation'),
      ),
      level: get(item, 'risk.level', ''),
      icon: get(item, 'category.icon'),
      component: (
        <TabInformation
          topIssue={this.topIssue}
          facility={this.facility}
          indicatorRiskData={item.indicatorRiskData}
          sourceRiskData={item.sourceRiskData}
          currentIndicatorId={this.currentIndicatorId}
          currentSubIndicatorId={this.currentSubIndicatorId}
          setCurrentRisk={(indicatorId: string, subIndicatorId: string) => {
            this.setCurrentRisk(
              get(item, 'category.id', ''),
              indicatorId,
              subIndicatorId,
            );
          }}
          addedCAP={this.addedCAP}
        />
      ),
    }));
  }

  created() {
    this.initTab();
  }

  initTab() {
    if (!isEmpty(this.sourceData) && this.currentCategoryId) {
      this.activeTab = this.sourceData.findIndex(
        ({ category }) => category.id === this.currentCategoryId,
      );
    }
  }

  changeTab(tabIndex: number): void {
    this.activeTab = tabIndex;
  }

  getIconSrc(iconId: string): string {
    const icon = this.resourceIcons.find(({ id }) => id === iconId);
    if (icon && icon.icon) {
      return get(resources, icon.icon, '');
    }
    return '';
  }

  renderIcon(src: string): JSX.Element {
    if (src) {
      return <Styled.Icon domProps={{ src }} />;
    }
    return <font-icon name="warning" size="70" color="alizarinCrimson" />;
  }

  renderTabs(): JSX.Element {
    return (
      <fragment>
        <Styled.Tabs>
          {map(this.tabs, (tab, index) => {
            const isActive = this.activeTab === index;
            const iconSource = this.getIconSrc(tab.icon);
            return (
              <Styled.Tab
                key={tab.name}
                isActive={isActive}
                level={tab.level}
                onClick={() => this.changeTab(index)}
              >
                {this.renderIcon(iconSource)}
                {tab.title}
              </Styled.Tab>
            );
          })}
        </Styled.Tabs>
        <Styled.ContentWrapper>
          {map(this.tabs, (item, index) => {
            return (
              <Styled.TabContent
                isActive={this.activeTab === index}
                key={item.name}
              >
                {item.component}
              </Styled.TabContent>
            );
          })}
        </Styled.ContentWrapper>
      </fragment>
    );
  }

  render(): JSX.Element {
    return <Styled.Wrapper>{this.renderTabs()}</Styled.Wrapper>;
  }
}
