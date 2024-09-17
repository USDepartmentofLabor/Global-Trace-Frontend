import { Vue, Component, Prop } from 'vue-property-decorator';
import { groupBy, isEmpty, map, orderBy, keys } from 'lodash';
import { UPLOAD_TRANSLATE } from 'config/constants';
import Button from 'components/FormUI/Button';
import * as Styled from './styled';

@Component
export default class ValidationModal extends Vue {
  @Prop({ default: '' })
  readonly title: string;
  @Prop({ default: UPLOAD_TRANSLATE.ACCEPTED })
  readonly extension: string;
  @Prop({ required: true })
  readonly validationErrors: Files.ValidationError[];
  @Prop({
    default: 0,
  })
  readonly numberErrors: number;
  @Prop({
    default: () => {
      //
    },
  })
  onCancel: () => void;

  get sortedErrors(): Files.ValidationError[] {
    return orderBy(this.validationErrors, 'index');
  }

  getRow(value: string): string {
    return this.extension === UPLOAD_TRANSLATE.ACCEPTED
      ? this.$t('index_number', { value })
      : this.$t('row_index', { value });
  }

  getIndexErrorMessage(error: Files.ValidationError): string {
    if (error.errors) {
      const subErrorList = map(error.errors, (e) =>
        error.isShowRow
          ? this.$t('row_error_upload_validate', {
              row: error.isShowRow ? this.getRow(error.index.toString()) : '',
              error: e.isShowKey ? [e.key, e.error].join('\n') : e.error,
              interpolation: { escapeValue: false },
            })
          : this.$t('index_error_upload_validate', {
              row: error.index,
              error: e.error,
              interpolation: { escapeValue: false },
            }),
      );
      return subErrorList.join('\n');
    }
    return this.$t('index_error_upload_validate', {
      row: error.rowIndex,
      error: error.error,
      interpolation: { escapeValue: false },
    });
  }

  closeModal(): void {
    if (this.onCancel) {
      this.onCancel();
    }
    this.$emit('close');
  }

  renderErrorTitle(): JSX.Element {
    if (isEmpty(this.title)) {
      return (
        <Styled.ErrorLabel>
          {this.numberErrors > 1
            ? this.$t('number_errors', {
                value: this.numberErrors,
              })
            : this.$t('number_error', {
                value: this.numberErrors,
              })}
        </Styled.ErrorLabel>
      );
    }
    return (
      <Styled.ErrorLabel>
        {this.numberErrors > 1
          ? this.$t('translate_errors_failed_validated', {
              value: this.title,
              total: this.numberErrors,
            })
          : this.$t('translate_error_failed_validated', {
              value: this.title,
              total: this.numberErrors,
            })}
      </Styled.ErrorLabel>
    );
  }

  renderErrors(): JSX.Element {
    if (this.extension === UPLOAD_TRANSLATE.ACCEPTED) {
      return (
        <Styled.Error>
          {map(this.sortedErrors, (error) => {
            const indexText = this.getIndexErrorMessage(error);
            return <Styled.ErrorBlock>{indexText}</Styled.ErrorBlock>;
          })}
        </Styled.Error>
      );
    }
    const groupedErrors = groupBy(this.sortedErrors, 'sheet');
    const sheets = keys(groupedErrors);
    return (
      <fragment>
        {map(sheets, (sheet) => (
          <Styled.Error>
            <Styled.ErrorLabel>{sheet}</Styled.ErrorLabel>
            {map(groupedErrors[sheet], (error) => {
              const indexText = this.getIndexErrorMessage(error);
              return <Styled.ErrorBlock>{indexText}</Styled.ErrorBlock>;
            })}
          </Styled.Error>
        ))}
      </fragment>
    );
  }

  renderErrorText(): JSX.Element {
    return <perfect-scrollbar>{this.renderErrors()}</perfect-scrollbar>;
  }

  renderAction(): JSX.Element {
    return (
      <Button
        width="100%"
        variant="outlinePrimary"
        label={this.$t('common.action.cancel')}
        click={this.closeModal}
      />
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout closeModal={this.closeModal}>
        <Styled.Container>
          {this.renderErrorTitle()}
          {this.renderErrorText()}
          {this.renderAction()}
        </Styled.Container>
      </modal-layout>
    );
  }
}
