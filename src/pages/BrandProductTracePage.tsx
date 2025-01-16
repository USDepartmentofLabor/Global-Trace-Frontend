import { Vue, Component } from 'vue-property-decorator';
import BrandProductTraceContainer from 'containers/BrandProductTraceContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('navbar.trace'),
})
export default class BrandProductTracePage extends Vue {
  render(): JSX.Element {
    return <BrandProductTraceContainer />;
  }
}
