import { Vue, Prop, Component } from 'vue-property-decorator';
import { SpinLoading } from 'components/Loaders';
import * as Styled from './styled';

@Component
export default class Tabs extends Vue {
  @Prop({ required: true }) readonly tabs: App.Tab[];
  @Prop({ default: false }) readonly isLoading: boolean;

  private activeTab: number = 0;

  onChangeTab(tab: number): void {
    this.activeTab = tab;
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
