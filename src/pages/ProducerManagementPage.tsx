import { Vue, Component } from 'vue-property-decorator';
import ProducerManagementContainer from 'containers/ProducerManagementContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('sidebar.user_management'),
})
export default class UserManagementPage extends Vue {
  render(): JSX.Element {
    return <ProducerManagementContainer />;
  }
}
