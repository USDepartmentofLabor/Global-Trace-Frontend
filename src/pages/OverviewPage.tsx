import { Vue, Component } from 'vue-property-decorator';
import OverviewContainer from 'containers/OverviewContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('sidebar.overview'),
})
export default class OverviewPage extends Vue {
  render(): JSX.Element {
    return <OverviewContainer />;
  }
}
