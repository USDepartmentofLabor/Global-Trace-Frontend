import { Vue, Component } from 'vue-property-decorator';
import GrievanceReportContainer from 'containers/GrievanceReportContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('sidebar.incident_reports'),
})
export default class GrievanceReportPage extends Vue {
  render(): JSX.Element {
    return <GrievanceReportContainer />;
  }
}
