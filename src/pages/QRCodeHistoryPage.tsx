import { Vue, Component } from 'vue-property-decorator';
import QRCodeHistoryContainer from 'containers/QRCodeHistoryContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('view_history'),
})
export default class QRCodeHistoryPage extends Vue {
  render(): JSX.Element {
    return <QRCodeHistoryContainer />;
  }
}
