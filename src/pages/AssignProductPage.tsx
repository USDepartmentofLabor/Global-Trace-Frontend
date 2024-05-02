import { Vue, Component } from 'vue-property-decorator';
import AssignProductContainer from 'containers/AssignProductContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('sidebar.homepage'),
})
export default class AssignProductPage extends Vue {
  render(): JSX.Element {
    return <AssignProductContainer />;
  }
}
