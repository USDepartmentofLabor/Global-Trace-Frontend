import { Vue, Component } from 'vue-property-decorator';
import MasterLayout from 'components/Layout/MasterLayout';
import PDFOrderContainer from 'containers/PDFOrderContainer';
import { getHead } from 'utils/app';
@Component({
  head: getHead('export_PDF_file'),
})
export default class PDFPreviewPage extends Vue {
  render(): JSX.Element {
    return (
      <MasterLayout>
        <PDFOrderContainer />
      </MasterLayout>
    );
  }
}
