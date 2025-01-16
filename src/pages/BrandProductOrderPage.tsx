import { Vue, Component } from 'vue-property-decorator';
import { BrandProductOrderContainer } from 'containers/BrandProductOrderContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('product_order'),
})
export default class BrandProductOrderPage extends Vue {
  render(): JSX.Element {
    return <BrandProductOrderContainer />;
  }
}
