import { Vue, Component } from 'vue-property-decorator';
import ForgotPasswordContainer from 'containers/ForgotPasswordContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('forgot_password'),
})
export default class ForgotPasswordPage extends Vue {
  render(): JSX.Element {
    return <ForgotPasswordContainer />;
  }
}
