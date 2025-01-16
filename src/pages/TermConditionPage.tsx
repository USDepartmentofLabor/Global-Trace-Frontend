import { Vue, Component } from 'vue-property-decorator';
import TermConditionContainer from 'containers/TermConditionContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('terms_conditions'),
})
export default class TermConditionPage extends Vue {
  render(): JSX.Element {
    return <TermConditionContainer />;
  }
}
