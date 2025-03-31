import { Vue, Component } from 'vue-property-decorator';
import SellContainer from 'containers/SellContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('sidebar.homepage'),
})
export default class SellPage extends Vue {
  render(): JSX.Element {
    return <SellContainer />;
  }
}
