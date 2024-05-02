import { Vue, Component } from 'vue-property-decorator';
import RecordByProductContainer from 'containers/RecordByProductContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('sidebar.homepage'),
})
export default class RecordByProductPage extends Vue {
  render(): JSX.Element {
    return <RecordByProductContainer />;
  }
}
