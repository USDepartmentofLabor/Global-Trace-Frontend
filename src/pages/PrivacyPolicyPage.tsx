import { Vue, Component } from 'vue-property-decorator';
import PrivacyPolicyContainer from 'containers/PrivacyPolicyContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('privacy_policy'),
})
export default class PrivacyPolicyPage extends Vue {
  render(): JSX.Element {
    return <PrivacyPolicyContainer />;
  }
}
