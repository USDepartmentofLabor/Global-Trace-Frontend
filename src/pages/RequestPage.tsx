import { Vue, Component } from 'vue-property-decorator';
import RequestContainer from 'containers/RequestContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('requestPage.requests_for_audit'),
})
export default class RequestPage extends Vue {
  render(): JSX.Element {
    return <RequestContainer />;
  }
}
