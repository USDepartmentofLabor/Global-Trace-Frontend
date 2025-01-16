import { Vue, Component } from 'vue-property-decorator';
import { ProductOrderContainer } from 'containers/BrandProductOrderContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('trace_product'),
})
export default class ProductOrderPage extends Vue {
  render(): JSX.Element {
    return <ProductOrderContainer />;
  }
}
