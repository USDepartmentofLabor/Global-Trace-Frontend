import { Vue, Component } from 'vue-property-decorator';
import SettingContainer from 'containers/SettingContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('sidebar.settings'),
})
export default class SettingPage extends Vue {
  render(): JSX.Element {
    return <SettingContainer />;
  }
}
