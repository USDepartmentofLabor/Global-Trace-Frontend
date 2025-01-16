import { Vue, Component, Prop } from 'vue-property-decorator';
import { map } from 'lodash';
import Button from 'components/FormUI/Button';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import AppModule from 'store/modules/app';
import ProductModule from 'store/modules/product';
import * as Styled from './styled';

@Component
export default class SelectOutputProduct extends Vue {
  @Prop({
    required: true,
  })
  request: () => Promise<ProductManagement.Product[]>;
  @Prop({
    default: () => {
      //
    },
  })
  select: (product: ProductManagement.Product) => void;
  private products: ProductManagement.Product[] = [];
  private isLoading = true;

  get currentLocale(): string {
    return AppModule.locale;
  }

  created() {
    this.getProducts();
  }

  async getProducts() {
    try {
      this.products = await this.request();
    } catch (error) {
      if (error) {
        handleError(error as App.ResponseError);
      }
    } finally {
      this.isLoading = false;
    }
  }

  getName(item: ProductManagement.Product): string {
    return item.nameTranslation[this.currentLocale] || item.name;
  }

  handleSelect(product: ProductManagement.Product) {
    ProductModule.setCurrentOutputProduct(product);
    this.select(product);
  }

  renderContent(): JSX.Element {
    if (this.isLoading) {
      return (
        <Styled.Loading>
          <SpinLoading />
        </Styled.Loading>
      );
    }
    return (
      <Styled.Content>
        <perfect-scrollbar>
          <Styled.List>
            {map(this.products, (item) => (
              <Styled.ListItem
                vOn:click={() => {
                  this.handleSelect(item);
                }}
              >
                <Styled.Name>{this.getName(item)}</Styled.Name>
                <Button
                  label={this.$t('common.action.select')}
                  icon="arrow_right"
                  iconPosition="suffix"
                  variant="transparentPrimary"
                />
              </Styled.ListItem>
            ))}
          </Styled.List>
        </perfect-scrollbar>
      </Styled.Content>
    );
  }

  render(): JSX.Element {
    return <Styled.Wrapper>{this.renderContent()}</Styled.Wrapper>;
  }
}
