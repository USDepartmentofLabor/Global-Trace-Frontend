import { Vue, Component } from 'vue-property-decorator';
import DashboardContainer from 'containers/DashboardContainer';

@Component
export default class DashboardPage extends Vue {
  render(): JSX.Element {
    return <DashboardContainer />;
  }
}
