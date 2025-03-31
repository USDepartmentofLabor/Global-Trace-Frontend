import { Vue, Component } from 'vue-property-decorator';
import CAPManagementContainer from 'containers/CAPManagementContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('cap'),
})
export default class CAPManagementPage extends Vue {
  render(): JSX.Element {
    return <CAPManagementContainer />;
  }
}
