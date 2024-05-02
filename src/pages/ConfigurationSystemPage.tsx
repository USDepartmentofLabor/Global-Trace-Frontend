import { Vue, Component } from 'vue-property-decorator';
import ConfigurationSystemContainer from 'containers/ConfigurationSystemContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('sidebar.settings'),
})
export default class ConfigurationSystemPage extends Vue {
  render(): JSX.Element {
    return <ConfigurationSystemContainer />;
  }
}
