import { Vue, Component } from 'vue-property-decorator';
import OnboardContainer from 'containers/OnboardContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('sidebar.onboard'),
})
export default class OnboardPage extends Vue {
  render(): JSX.Element {
    return <OnboardContainer />;
  }
}
