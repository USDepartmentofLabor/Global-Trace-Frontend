import { Vue, Component, Prop } from 'vue-property-decorator';
import { get } from 'lodash';
import { DEFAULT_LANGUAGE } from 'config/constants';
import AppModule from 'store/modules/app';
import * as Styled from './styled';
import TabInformation from '../TabInformation/TabInformation';

@Component
export default class InformationDetail extends Vue {
  @Prop({ required: true }) readonly sourceData: Auth.SupplierData[];

  private activeTab: number = 0;

  get currentLocale(): string {
    return AppModule.locale;
  }

  get tabs(): App.Tab[] {
    return this.sourceData.map((item) => ({
      title: this.getCategoryName(
        get(item, 'category.name', ''),
        get(item, 'category.translation'),
      ),
      level: get(item, 'risk.level', ''),
      component: (
        <TabInformation
          indicatorRiskData={item.indicatorRiskData}
          sourceRiskData={item.sourceRiskData}
        />
      ),
    }));
  }

  getCategoryName(
    name: string,
    translation: {
      [x: string]: string;
    },
  ): string {
    return this.currentLocale === DEFAULT_LANGUAGE
      ? name
      : translation?.[this.currentLocale] || name;
  }

  changeTab(tabIndex: number): void {
    this.activeTab = tabIndex;
  }

  renderTabs(): JSX.Element {
    return (
      <fragment>
        <Styled.Tabs>
          {this.tabs.map((tab, index) => {
            const isActive = this.activeTab === index;
            return (
              <Styled.Tab
                key={index}
                isActive={isActive}
                level={tab.level}
                onClick={() => this.changeTab(index)}
              >
                {tab.title}
              </Styled.Tab>
            );
          })}
        </Styled.Tabs>
        <Styled.ContentWrapper>
          {this.tabs.map((item, index) => {
            return (
              <Styled.TabContent
                isActive={this.activeTab === index}
                key={index.toString()}
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
