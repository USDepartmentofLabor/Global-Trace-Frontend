import { Vue, Component } from 'vue-property-decorator';
import QRCodeManagementContainer from 'containers/QRCodeManagementContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('sidebar.qr_code_management'),
})
export default class QRCodeManagementPage extends Vue {
  render(): JSX.Element {
    return <QRCodeManagementContainer />;
  }
}
