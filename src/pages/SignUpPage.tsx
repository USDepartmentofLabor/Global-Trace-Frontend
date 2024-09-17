import { Vue, Component } from 'vue-property-decorator';
import SignUpContainer from 'containers/SignUpContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('sign_up'),
})
export default class SignUpPage extends Vue {
  render(): JSX.Element {
    return <SignUpContainer />;
  }
}
