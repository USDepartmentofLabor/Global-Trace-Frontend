import { Vue, Component } from 'vue-property-decorator';
import MasterLayout from 'components/Layout/MasterLayout';
import PDFSupplierDetailContainer from 'containers/PDFSupplierDetailContainer';
import { getHead } from 'utils/app';

@Component({
  head: getHead('export_PDF_file'),
})
export default class PDFPreviewPage extends Vue {
  render(): JSX.Element {
    return (
      <MasterLayout>
        <PDFSupplierDetailContainer />
      </MasterLayout>
    );
  }
}
