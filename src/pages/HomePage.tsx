import { Vue, Component } from 'vue-property-decorator';
import HomeContainer from 'containers/HomeContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('sidebar.homepage'),
})
export default class HomePage extends Vue {
  render(): JSX.Element {
    return <HomeContainer />;
  }
}
