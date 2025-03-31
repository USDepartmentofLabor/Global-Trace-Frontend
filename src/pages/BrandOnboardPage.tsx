import { Vue, Component } from 'vue-property-decorator';
import BrandOnboardContainer from 'containers/BrandOnboardContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('sidebar.onboard'),
})
export default class BrandOnboardPage extends Vue {
  render(): JSX.Element {
    return <BrandOnboardContainer />;
  }
}
