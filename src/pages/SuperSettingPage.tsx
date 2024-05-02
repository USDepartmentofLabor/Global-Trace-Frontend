import { Vue, Component } from 'vue-property-decorator';
import SuperSettingContainer from 'containers/SuperSettingContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('sidebar.settings'),
})
export default class SuperSettingPage extends Vue {
  render(): JSX.Element {
    return <SuperSettingContainer />;
  }
}
