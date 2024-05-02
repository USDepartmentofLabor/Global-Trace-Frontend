import { Vue, Component } from 'vue-property-decorator';
import ResetPasswordContainer from 'containers/ResetPasswordContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('common.action.reset_password'),
})
export default class ResetPasswordPage extends Vue {
  render(): JSX.Element {
    return <ResetPasswordContainer />;
  }
}
