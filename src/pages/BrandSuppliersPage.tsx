import { Vue, Component } from 'vue-property-decorator';
import BrandSuppliersContainer from 'containers/BrandSuppliersContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('suppliers'),
})
export default class BrandSuppliersPage extends Vue {
  render(): JSX.Element {
    return <BrandSuppliersContainer />;
  }
}
