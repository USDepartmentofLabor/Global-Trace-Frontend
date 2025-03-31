import { Vue, Component } from 'vue-property-decorator';
import PageNotFoundContainer from 'containers/PageNotFoundContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('sidebar.page_not_found'),
})
export default class PageNotFound extends Vue {
  render(): JSX.Element {
    return <PageNotFoundContainer />;
  }
}
