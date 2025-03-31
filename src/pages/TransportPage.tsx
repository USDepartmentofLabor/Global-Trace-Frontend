import { Vue, Component } from 'vue-property-decorator';
import TransportContainer from 'containers/TransportContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('sidebar.homepage'),
})
export default class TransportPage extends Vue {
  render(): JSX.Element {
    return <TransportContainer />;
  }
}
