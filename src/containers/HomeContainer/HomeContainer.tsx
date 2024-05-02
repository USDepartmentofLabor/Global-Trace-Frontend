import { Vue, Component } from 'vue-property-decorator';
import { find, isEmpty, isNull } from 'lodash';
import auth from 'store/modules/auth';
import { RESOURCES } from 'config/constants';
import * as Styled from './styled';

@Component
export default class HomeContainer extends Vue {
  get panels(): Homepage.Panel[] {
    return [
      auth.hasPurchaseMenu
        ? {
            name: 'purchase',
            routeName: 'Purchase',
          }
        : null,
      auth.hasAssignProductMenu
        ? {
            name: 'transformation',
            routeName: 'AssignProduct',
          }
        : null,
      auth.hasRecordByProductMenu
        ? {
            name: 'record_by_product',
            routeName: 'RecordByProduct',
          }
        : null,
      auth.hasSellMenu
        ? {
            name: 'sell',
            routeName: 'Sell',
          }
        : null,
      auth.hasTransportMenu
        ? {
            name: 'transport',
            routeName: 'Transport',
          }
        : null,
    ].filter((menu) => !isNull(menu));
  }

  get showPanelContent(): boolean {
    return !isEmpty(
      find(this.panels, ({ routeName }) => routeName === this.$route.name),
    );
  }

  redirectToRoute(routeName: string): void {
    if (routeName !== this.$route.name) {
      this.$router.push({ name: routeName });
    }
  }

  close(): void {
    this.redirectToRoute('Homepage');
  }

  isPanelActive(routeName: string): boolean {
    return this.$route.name == routeName;
  }

  renderPanel(): JSX.Element {
    return (
      <Styled.PanelWrapper isColumnLayout={auth.isColumnLayout}>
        <Styled.Box showPanelContent={this.showPanelContent}>
          {this.panels.map((panel) => (
            <Styled.Panel
              isActive={this.isPanelActive(panel.routeName)}
              vOn:click={() => this.redirectToRoute(panel.routeName)}
            >
              <Styled.PanelImage
                domProps={{
                  src: RESOURCES[panel.name.toUpperCase()],
                }}
              />
              <Styled.PanelFooter>{this.$t(panel.name)}</Styled.PanelFooter>
            </Styled.Panel>
          ))}
        </Styled.Box>
      </Styled.PanelWrapper>
    );
  }

  renderContent(): JSX.Element {
    if (this.showPanelContent) {
      return (
        <Styled.Content>
          <Styled.CloseIcon vOn:click={this.close}>
            <font-icon name="arrow_left" size="22" color="envy" />
          </Styled.CloseIcon>
          <Styled.Container>
            <router-view />
          </Styled.Container>
        </Styled.Content>
      );
    }
  }

  render(): JSX.Element {
    return (
      <dashboard-layout>
        <Styled.Wrapper showPanelContent={this.showPanelContent}>
          {!this.showPanelContent && this.renderPanel()}
          {this.renderContent()}
        </Styled.Wrapper>
      </dashboard-layout>
    );
  }
}
