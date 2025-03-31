import { Vue, Component } from 'vue-property-decorator';
import BrandProfileContainer from 'containers/BrandProfileContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('sidebar.my_profile'),
})
export default class BrandProfilePage extends Vue {
  render(): JSX.Element {
    return <BrandProfileContainer />;
  }
}
