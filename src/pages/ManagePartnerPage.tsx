import { Vue, Component } from 'vue-property-decorator';
import ManagePartnerContainer from 'containers/ManagePartnerContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('sidebar.manage_partners'),
})
export default class ManagePartnerPage extends Vue {
  render(): JSX.Element {
    return <ManagePartnerContainer />;
  }
}
