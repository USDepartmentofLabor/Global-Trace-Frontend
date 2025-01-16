import { Vue, Component } from 'vue-property-decorator';
import MyProfileContainer from 'containers/MyProfileContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('sidebar.my_profile'),
})
export default class MyProfilePage extends Vue {
  render(): JSX.Element {
    return <MyProfileContainer />;
  }
}
