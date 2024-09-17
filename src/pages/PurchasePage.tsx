import { Vue, Component } from 'vue-property-decorator';
import PurchaseContainer from 'containers/PurchaseContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('trace_product'),
})
export default class PurchasePage extends Vue {
  render(): JSX.Element {
    return <PurchaseContainer />;
  }
}
