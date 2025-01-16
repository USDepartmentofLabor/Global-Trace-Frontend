import { Vue, Component } from 'vue-property-decorator';
import AuditorProfileContainer from 'containers/AuditorProfileContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('sidebar.my_profile'),
})
export default class AuditorProfilePage extends Vue {
  render(): JSX.Element {
    return <AuditorProfileContainer />;
  }
}
