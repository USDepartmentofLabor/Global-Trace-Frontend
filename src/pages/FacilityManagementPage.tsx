import { Vue, Component } from 'vue-property-decorator';
import FacilityManagementContainer from 'containers/FacilityManagementContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('sidebar.facility_management'),
})
export default class FacilityManagementPage extends Vue {
  render(): JSX.Element {
    return <FacilityManagementContainer />;
  }
}
