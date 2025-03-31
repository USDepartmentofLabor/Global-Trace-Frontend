import { Vue, Component } from 'vue-property-decorator';
import moment from 'moment';
import { some, isEmpty, values, get } from 'lodash';
import { dateToISOString, convertDateToTimestamp } from 'utils/date';
import { createRecordByProduct } from 'api/record-by-product';
import { DATE_TIME_FORMAT } from 'config/constants';
import ProducerLayout from 'components/Layout/ProducerLayout';
import DatePicker from 'components/FormUI/DatePicker';
import FileUpload from 'components/FormUI/FileUpload';
import Button from 'components/FormUI/Button';
import InputWeight from 'components/FormUI/Input/InputWeight';
import { handleError } from 'components/Toast';
import * as Styled from 'styles/producer';

@Component
export default class RecordByProduct extends Vue {
  private isSubmitting: boolean = false;
  private formName: string = 'recordByProduct';
  private messageErrors: App.MessageError = null;
  private hasErrorUpload: boolean = false;

  private formInput: RecordByProduct.RequestParams = {
    totalWeight: null,
    weightUnit: null,
    recordedAt: null,
    uploadProofs: [],
  };

  get formData(): RecordByProduct.RequestParams {
    return this.$formulate.registry.get(this.formName).proxy;
  }

  get recordedAt(): Date {
    const { recordedAt } = this.formData;
    return recordedAt ? moment(recordedAt).toDate() : null;
  }

  set recordedAt(value: Date) {
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      recordedAt: value ? dateToISOString(value) : null,
    });
  }

  get isDisabledSubmit(): boolean {
    const { uploadProofs, recordedAt } = this.formInput;
    return (
      this.isSubmitting ||
      isEmpty(uploadProofs) ||
      isEmpty(recordedAt) ||
      this.hasErrorUpload
    );
  }

  disabledDate(date: Date): boolean {
    const validDate = moment().toDate();
    return date > validDate;
  }

  onChangeDateTime(recordedAt: string): void {
    this.recordedAt = recordedAt ? moment(recordedAt).toDate() : null;
  }

  onChangeFiles(selectedFiles: App.SelectedFile[]): void {
    this.hasErrorUpload = some(selectedFiles, ['isError', true]);
    this.formInput.uploadProofs = selectedFiles.map(({ file }) => file);
  }

  onChangeUnit(id: string): void {
    this.formInput.weightUnit = id;
  }

  onSubmit(): void {
    this.isSubmitting = true;
    createRecordByProduct({
      ...this.formData,
      recordedAt: convertDateToTimestamp(this.recordedAt),
    })
      .then(() => {
        this.$router.push({ name: 'Homepage' });
        this.$toast.success(this.$t('data_saved'));
      })
      .catch((error: App.ResponseError) => {
        const errors = get(error, 'errors');
        if (values(errors).length > 0) {
          this.messageErrors = errors;
        } else {
          handleError(error as App.ResponseError);
        }
      })
      .finally(() => {
        this.isSubmitting = false;
      });
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  renderDatetime(): JSX.Element {
    return (
      <Styled.Row>
        <DatePicker
          label={this.$t('date_time')}
          height="48px"
          type="datetime"
          placeholder={this.$t('date_time')}
          value={this.recordedAt}
          selectDate={this.onChangeDateTime}
          disabledDate={this.disabledDate}
          disabled={this.isSubmitting}
          format={DATE_TIME_FORMAT}
        />
      </Styled.Row>
    );
  }

  renderAction(hasErrors: boolean): JSX.Element {
    return (
      <Styled.Action>
        <Button
          width="100%"
          type="submit"
          label={this.$t('common.action.save_changes')}
          variant="primary"
          icon="arrow_right"
          iconPosition="suffix"
          isLoading={this.isSubmitting}
          disabled={hasErrors || this.isDisabledSubmit}
        />
      </Styled.Action>
    );
  }

  renderUploadProof(): JSX.Element {
    return (
      <Styled.Row>
        <FileUpload
          values={[]}
          disabled={this.isSubmitting}
          label={this.$t('upload_proof')}
          changeFiles={this.onChangeFiles}
        />
      </Styled.Row>
    );
  }

  renderWeight(): JSX.Element {
    return (
      <InputWeight
        disabled={this.isSubmitting}
        messageErrors={this.messageErrors}
        minWeight={1}
        changeUnit={this.onChangeUnit}
        changeInput={this.onClearMessageErrors}
        name="totalWeight"
      />
    );
  }

  renderForm(): JSX.Element {
    return (
      <formulate-form
        name={this.formName}
        v-model={this.formInput}
        vOn:submit={this.onSubmit}
        scopedSlots={{
          default: ({ hasErrors }: { hasErrors: boolean }) => (
            <fragment>
              <Styled.Form>
                <Styled.FormContent>
                  {this.renderWeight()}
                  {this.renderDatetime()}
                  <Styled.Line />
                  {this.renderUploadProof()}
                </Styled.FormContent>
              </Styled.Form>
              {this.renderAction(hasErrors)}
            </fragment>
          ),
        }}
      />
    );
  }

  render(): JSX.Element {
    return (
      <ProducerLayout title={this.$t('record_by_product')}>
        <Styled.Container>{this.renderForm()}</Styled.Container>
      </ProducerLayout>
    );
  }
}
