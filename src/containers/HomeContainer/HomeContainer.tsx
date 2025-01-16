import { Vue, Component } from 'vue-property-decorator';
import { find, isEmpty, isNull, get } from 'lodash';
import auth from 'store/modules/auth';
import { RESOURCES } from 'config/constants';
import * as Styled from './styled';

const SelectOutputProductModal = () =>
  import('modals/SelectOutputProductModal');

@Component
export default class HomeContainer extends Vue {
  get panels(): Homepage.Panel[] {
    return [
      auth.hasLogPurchase
        ? {
            name: 'purchase',
            routeName: 'Purchase',
          }
        : null,
      auth.hasLogTransformation
        ? {
            name: 'transformation',
            routeName: 'AssignProduct',
          }
        : null,
      auth.hasLogByProduct
        ? {
            name: 'record_by_product',
            routeName: 'RecordByProduct',
          }
        : null,
      auth.hasLogSale
        ? {
            name: 'sell',
            routeName: 'Sell',
          }
        : null,
      auth.hasLogTransport
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

  openOutputProductModal(): void {
    this.$modal.show(
      SelectOutputProductModal,
      {
        onSuccess: this.onSelectOutputProduct,
      },
      {
        name: 'selectOutputProductModal',
        width: '640px',
        classes: 'overflow-visible',
        clickToClose: false,
        adaptive: true,
      },
    );
  }

  onSelectOutputProduct(product: ProductManagement.Product) {
    this.$router.push({
      name: 'AssignProduct',
      query: {
        outputProductId: product.id,
      },
    });
  }

  redirectToRoute(routeName: string): void {
    if (routeName === 'AssignProduct') {
      this.openOutputProductModal();
    } else if (routeName !== this.$route.name) {
      this.$router.push({ name: routeName });
    }
  }

  renderPanel(): JSX.Element {
    return (
      <Styled.PanelWrapper>
        <Styled.Box>
          {this.panels.map((panel) => (
            <Styled.Panel
              vOn:click={() => this.redirectToRoute(panel.routeName)}
            >
              <Styled.PanelImage
                domProps={{ src: get(RESOURCES, [panel.name.toUpperCase()]) }}
              />
              <Styled.PanelFooter>
                {this.$t(panel.name)}
                <font-icon name="arrow_right" size="24" />
              </Styled.PanelFooter>
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
