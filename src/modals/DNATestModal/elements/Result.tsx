import { Vue, Component, Prop } from 'vue-property-decorator';
import moment from 'moment';
import DatePicker from 'components/FormUI/DatePicker';
import Dropdown from 'components/FormUI/Dropdown';
import FileUpload from 'components/FormUI/FileUpload';
import { DATE_FORMAT } from 'config/constants';
import { YesNoEnum } from 'enums/brand';
import * as Styled from './styled';
import DNAIdentifierList from './DNAIdentifierList';

@Component
export default class Result extends Vue {
  @Prop({ required: true }) isSubmitting: boolean;
  @Prop({ required: true }) testedAt: Date;
  @Prop({ required: true }) changeTestedAt: (date: string) => void;
  @Prop({ required: true }) changeUploadFiles: (
    selectedFiles: App.SelectedFile[],
  ) => void;
  @Prop({ required: true }) changeDNA: (
    isDetected: boolean,
    dnaList: string[],
  ) => void;

  private detectSelected: App.DropdownOption = null;
  private detectOptions: App.DropdownOption[] = [
    { id: YesNoEnum.YES, name: this.$t('yes') },
    {
      id: YesNoEnum.NO,
      name: this.$t('no'),
    },
  ];

  get isDetected(): boolean {
    return this.detectSelected && this.detectSelected.id === YesNoEnum.YES;
  }

  disabledDate(date: Date): boolean {
    const validDate = moment().toDate();
    return date > validDate;
  }

  onChangeDetect(option: App.DropdownOption): void {
    this.detectSelected = option;
    this.changeDNA(this.isDetected, []);
  }

  renderDateOfTest(): JSX.Element {
    return (
      <DatePicker
        label={this.$t('createDNATestModal.date_of_test')}
        placeholder={this.$t('date_format')}
        name="testedAt"
        height="48px"
        type="date"
        value={this.testedAt}
        selectDate={this.changeTestedAt}
        disabledDate={this.disabledDate}
        disabled={this.isSubmitting}
        format={DATE_FORMAT}
      />
    );
  }

  renderDNAIdentifier(): JSX.Element {
    return (
      <Dropdown
        title={this.$t('createDNATestModal.DNA_detected')}
        placeholder={this.$t('createDNATestModal.DNA_identifiers')}
        options={this.detectOptions}
        height="48px"
        value={this.detectSelected}
        changeOptionValue={this.onChangeDetect}
        overflow
        allowEmpty={false}
      />
    );
  }

  renderUploadFile(): JSX.Element {
    return (
      <FileUpload
        variant="secondary"
        inputId="uploadProofs"
        disabled={this.isSubmitting}
        label={this.$t('upload_proof')}
        accept="application/pdf,image/*"
        changeFiles={this.changeUploadFiles}
      />
    );
  }

  render(): JSX.Element {
    return (
      <fragment>
        <Styled.Title>{this.$t('result')}</Styled.Title>
        <Styled.Container>
          {this.renderDateOfTest()}
          {this.renderDNAIdentifier()}
          {this.isDetected && (
            <DNAIdentifierList
              isSubmitting={this.isSubmitting}
              change={(items: string[]) =>
                this.changeDNA(this.isDetected, items)
              }
            />
          )}
          {this.renderUploadFile()}
        </Styled.Container>
      </fragment>
    );
  }
}
