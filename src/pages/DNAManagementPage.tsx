import { Vue, Component } from 'vue-property-decorator';
import DNAManagementContainer from 'containers/DNAManagementContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('dna_test'),
})
export default class DNAManagementPage extends Vue {
  render(): JSX.Element {
    return <DNAManagementContainer />;
  }
}
