import { Vue, Component } from 'vue-property-decorator';
import UserManagementContainer from 'containers/UserManagementContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('sidebar.user_management'),
})
export default class UserManagementPage extends Vue {
  render(): JSX.Element {
    return <UserManagementContainer />;
  }
}
