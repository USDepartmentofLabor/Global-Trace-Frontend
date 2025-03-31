import { Vue, Component, Prop } from 'vue-property-decorator';
import { get, isEmpty, map } from 'lodash';
import Button from 'components/FormUI/Button';
import * as Styled from './styled';
import ImportFile from './ImportFile';

const ActionModal = () => import('modals/ActionModal');

@Component
export default class ImportValidation extends Vue {
  @Prop({ required: true }) readonly fileName: string;
  @Prop({ default: false }) readonly isMultipleSheets: boolean;
  @Prop({ default: false }) readonly isLoading: boolean;
  @Prop({
    default: 'default',
    validator(this, value) {
      return ['default', 'circle'].includes(value);
    },
  })
  readonly variant: string;
  @Prop({ required: true })
  readonly response: Files.UploadedFileResponse[];
  @Prop({ default: 'upload_validated_suppliers' }) readonly labelUpload: string;
  @Prop({ default: '' }) readonly labelValidated: string;
  @Prop({
    default: () => {
      //
    },
  })
  validateFile: (file: App.SelectedFile) => Promise<void>;
  @Prop({
    default: () => {
      //
    },
  })
  validatedFile: (file: App.SelectedFile) => void;
  @Prop({
    default: () => {
      //
    },
  })
  uploadFile: () => void;
  @Prop({
    default: () => {
      //
    },
  })
  resetUpload: () => void;
  @Prop({
    default: () => {
      //
    },
  })
  addFile: (file: App.SelectedFile, isAnotherFile: boolean) => void;

  get isEmpty(): boolean {
    return this.totalItems === this.validatedItemCount && this.totalItems === 0;
  }

  get validationErrors(): Files.ValidationError[] {
    if (this.isEmpty) {
      return [];
    }
    return get(this.response, 'validationErrors', []);
  }

  get totalItems(): number {
    return get(this.response, 'totalItems', 0);
  }

  get validatedItemCount(): number {
    return get(this.response, 'validatedItemCount', 0);
  }

  get numberErrors(): number {
    if (this.isMultipleSheets) {
      return this.totalItems - this.validatedItemCount;
    }
    return this.validationErrors.length;
  }

  get hasError(): boolean {
    return this.numberErrors > 0;
  }

  getIndexErrorMessage(error: Files.ValidationError): string {
    if (error.errors) {
      const subErrorList = map(error.errors, (e) =>
        this.$t('row_error_upload_validate', {
          row: error.isShowRow
            ? this.$t('row_index', { value: error.index })
            : '',
          error: e.isShowKey ? [e.key, e.error].join('\n') : e.error,
          interpolation: { escapeValue: false },
        }),
      );
      return subErrorList.join('\n');
    }
    return this.$t('row_error_upload_validate', {
      row: error.rowIndex,
      error: error.error,
      interpolation: { escapeValue: false },
    });
  }

  getErrorText(): string {
    const errorsList = map(this.validationErrors, (error) => {
      let sheetName = '';
      if (this.isMultipleSheets && sheetName !== error.sheet) {
        sheetName = error.sheet;
        return sheetName + '\n' + this.getIndexErrorMessage(error);
      }
      return this.getIndexErrorMessage(error);
    });
    return errorsList.join('\n\n');
  }

  openCopiedModal(): void {
    navigator.clipboard.writeText(this.getErrorText());
    this.$modal.show(
      ActionModal,
      {
        icon: 'copied',
        iconSize: '53',
        title: this.$t('copied_to_clipboard'),
      },
      {
        name: 'actionModal',
        width: '322px',
        height: '144px',
        open: this.closeCopiedModal(),
      },
    );
  }

  closeCopiedModal(): void {
    setTimeout(() => {
      this.$modal.hide('actionModal');
    }, 1000);
  }

  renderImport(): JSX.Element {
    return (
      <Styled.Content variant={this.variant}>
        {this.renderNotice()}
        <font-icon name="double_arrow" size="40" color="surfCrest" />
        <font-icon name="uploaded" size="130" color="cornflowerBlue" />
        <ImportFile
          inputId="upload-another-file"
          validateFile={this.validateFile}
          addFile={this.addFile}
          validatedFile={this.validatedFile}
        >
          <Styled.Text>{this.$t('choose_another_file')}</Styled.Text>
        </ImportFile>
        <Styled.Actions>
          {!this.hasError && !this.isEmpty && (
            <Button
              label={this.$t(this.labelUpload)}
              width="240px"
              isLoading={this.isLoading}
              click={this.uploadFile}
            />
          )}
          <Button
            label={this.$t('common.action.cancel')}
            width="240px"
            type="button"
            variant="transparentPrimary"
            isDisabled={this.isLoading}
            click={this.resetUpload}
          />
        </Styled.Actions>
      </Styled.Content>
    );
  }

  renderNotice(): JSX.Element {
    const isFail = this.hasError;
    const isSuccessMultipleSheet =
      !isFail && !this.isEmpty && this.isMultipleSheets;
    const isSuccessOneSheet =
      !isFail && !this.isEmpty && !this.isMultipleSheets;
    const isEmptyFile = this.isEmpty && !isFail;
    return (
      <Styled.Information>
        <Styled.Label>{this.fileName}</Styled.Label>
        {isSuccessMultipleSheet && (
          <Styled.Label isStrong>
            {this.labelValidated ||
              this.$t('facility_group_has_been_validated')}
          </Styled.Label>
        )}
        {isSuccessOneSheet && (
          <Styled.Label isStrong>
            <text-direction>
              {this.$t('records_successfully_validated', {
                value: this.totalItems,
              })}
            </text-direction>
          </Styled.Label>
        )}
        {isFail && (
          <Styled.Label isStrong isFail>
            <text-direction>
              {this.$t('records_failed_validated', {
                value: this.numberErrors,
                total: this.totalItems,
              })}
            </text-direction>
          </Styled.Label>
        )}
        {isEmptyFile && (
          <Styled.Label isStrong isFail>
            <text-direction>{this.$t('empty_file_upload')}</text-direction>
          </Styled.Label>
        )}
      </Styled.Information>
    );
  }

  renderErrorText(): JSX.Element {
    let sheetName = '';
    return (
      <Styled.Error>
        {map(this.validationErrors, (error) => {
          const rowText = this.getIndexErrorMessage(error);
          if (
            this.isMultipleSheets &&
            !isEmpty(error.errors) &&
            sheetName !== error.sheet
          ) {
            sheetName = error.sheet;
            return (
              <Styled.ErrorBlock>
                <Styled.ErrorLabel>{sheetName}</Styled.ErrorLabel>
                <Styled.ErrorText>{rowText}</Styled.ErrorText>
              </Styled.ErrorBlock>
            );
          }
          return <Styled.ErrorBlock>{rowText}</Styled.ErrorBlock>;
        })}
      </Styled.Error>
    );
  }

  renderValidateFail(): JSX.Element {
    return (
      <Styled.ValidationDetail variant={this.variant}>
        <Styled.Head>
          <Styled.TextDanger>
            <text-direction>
              {this.numberErrors > 1
                ? this.$t('number_errors', {
                    value: this.numberErrors,
                  })
                : this.$t('number_error', {
                    value: this.numberErrors,
                  })}
            </text-direction>
          </Styled.TextDanger>
          <Button
            icon="copy"
            variant="transparentSecondary"
            label={this.$t('common.action.copy')}
            underlineLabel
            click={this.openCopiedModal}
            iconSize="18"
          />
        </Styled.Head>
        <Styled.List>
          <perfect-scrollbar>{this.renderErrorText()}</perfect-scrollbar>
        </Styled.List>
      </Styled.ValidationDetail>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Container variant={this.variant}>
        {this.renderImport()}
        {this.hasError && this.renderValidateFail()}
      </Styled.Container>
    );
  }
}
