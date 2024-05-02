import { Vue, Prop, Component } from 'vue-property-decorator';
import { findIndex, get } from 'lodash';
import { SpinLoading } from 'components/Loaders';
import * as Styled from './styled';

@Component
export default class ConfigurationTabs extends Vue {
  @Prop({ required: true }) readonly tabs: App.Tab[];
  @Prop({ default: false }) readonly isLoading: boolean;

  private activeTab: number = 0;

  onChangeTab(tabIndex: number): void {
    this.activeTab = tabIndex;
    const tab = this.tabs[tabIndex];
    const tabName = get(this.$route, 'query.tabName');
    if (tabName !== tab.name) {
      this.$router.push({
        query: {
          tabName: tab.name,
        },
      });
    }
  }

  created() {
    const tabName = get(this.$route, 'query.tabName');
    if (tabName) {
      const tabIndex = findIndex(this.tabs, ({ name }) => name === tabName);
      if (tabIndex > -1) {
        this.activeTab = tabIndex;
      }
    }
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        {this.isLoading && <SpinLoading />}
        {!this.isLoading && (
          <fragment>
            <Styled.TabHeader>
              {this.tabs.map((item, index) => (
                <Styled.Tab
                  key={index}
                  isActive={this.activeTab === index}
                  onClick={() => this.onChangeTab(index)}
                >
                  {item.title}
                </Styled.Tab>
              ))}
            </Styled.TabHeader>
            <Styled.ContentWrapper>
              {this.tabs.map((item, index) => {
                return (
                  <Styled.TabContent
                    isActive={this.activeTab === index}
                    key={index.toString()}
                  >
                    {this.$scopedSlots.tab({ item })}
                  </Styled.TabContent>
                );
              })}
            </Styled.ContentWrapper>
          </fragment>
        )}
      </Styled.Wrapper>
    );
  }
}
