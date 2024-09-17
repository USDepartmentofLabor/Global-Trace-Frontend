import { Component, Vue } from 'vue-property-decorator';
import SignInContainer from 'containers/SignInContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('sign_in'),
})
export default class SignInPage extends Vue {
  render(): JSX.Element {
    return <SignInContainer />;
  }
}
