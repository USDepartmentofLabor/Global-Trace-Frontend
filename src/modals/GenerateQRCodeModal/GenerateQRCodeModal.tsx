import { Vue, Component, Prop } from 'vue-property-decorator';
import { get } from 'lodash';
import { getShortToken } from 'api/auth';
import { downloadQRCodeUrl } from 'utils/download-helper';
import { createQRCode } from 'api/qr-code-management';
import Button from 'components/FormUI/Button';
import InputGroup from 'components/FormUI/InputGroup';
import { handleError } from 'components/Toast';
import QRCodeInfo from './elements/QRCodeInfo';
import * as Styled from './styled';

@Component
export default class GenerateQRCodeModal extends Vue {
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  onSuccess: () => void;

  private formInput: QRCodeManagement.QRCodeRequestParams = {
    name: '',
    quantity: null,
  };
  private QRCodeInfo: QRCodeManagement.QRCodeRequestParams = {
    name: '',
    quantity: null,
  };
  private isSubmitting: boolean = false;
  private isLoading: boolean = false;
  private messageErrors: App.MessageError = null;
  private createdQRCode: QRCodeManagement.QRCode = null;

  get fromData(): QRCodeManagement.QRCodeRequestParams {
    return {
      name: this.formInput.name,
      quantity: parseInt(this.formInput.quantity.toString(), 10),
    };
  }

  get isGenerated(): boolean {
    return this.createdQRCode !== null;
  }

  get isDisableSubmit(): boolean {
    return (
      this.isSubmitting ||
      this.isLoading ||
      (this.formInput.quantity && this.fromData.quantity === 0)
    );
  }

  get label(): string {
    if (this.QRCodeInfo.quantity > 1) {
      return this.$t('qr_codes', { value: this.QRCodeInfo.quantity });
    }
    return this.$t('qr_code', { value: this.QRCodeInfo.quantity });
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  async onSubmit(): Promise<void> {
    this.isSubmitting = true;
    try {
      this.QRCodeInfo = this.fromData;
      this.createdQRCode = await createQRCode(this.fromData);
    } catch (error) {
      this.messageErrors = get(error, 'errors');
    } finally {
      this.isSubmitting = false;
    }
  }

  async success(): Promise<void> {
    try {
      this.isLoading = true;
      const response = await getShortToken();
      const downloadUrl = downloadQRCodeUrl(
        this.createdQRCode.id,
        response.shortToken,
      );
      window.open(downloadUrl, '_blank');
      this.onSuccess();
      this.closeModal();
      this.$toast.success(this.$t(`generate_qr_code_success`));
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  closeModal(): void {
    this.$emit('close');
  }

  renderActions(hasErrors: boolean): JSX.Element {
    return (
      <Styled.Actions>
        <Styled.ButtonGroupEnd>
          <Button
            type="button"
            variant="transparentPrimary"
            label={this.$t('common.action.cancel')}
            disabled={this.isSubmitting}
            click={this.closeModal}
          />
          <Button
            type="submit"
            variant="primary"
            label={this.$t('generate')}
            isLoading={this.isSubmitting}
            disabled={this.isDisableSubmit || hasErrors}
          />
        </Styled.ButtonGroupEnd>
      </Styled.Actions>
    );
  }

  renderForm(): JSX.Element {
    return (
      <formulate-form
        v-model={this.formInput}
        name="userForm"
        scopedSlots={{
          default: ({ hasErrors }: { hasErrors: boolean }) => (
            <InputGroup>
              <QRCodeInfo
                disabled={this.isSubmitting}
                messageErrors={this.messageErrors}
                changeValue={this.onClearMessageErrors}
              />
              {this.renderActions(hasErrors)}
            </InputGroup>
          ),
        }}
        vOn:submit={this.onSubmit}
      />
    );
  }

  renderGeneratedContent(): JSX.Element {
    return (
      <Styled.GeneratedContent>
        <font-icon name="check_circle" size="40" color="envy" />
        <Styled.SuccessTitle>
          {this.$t('successfully_generated')}
        </Styled.SuccessTitle>
        <Styled.QRCodeName>{this.QRCodeInfo.name}</Styled.QRCodeName>
        <Styled.QRCodeQuantity>
          <text-direction>{this.label}</text-direction>
        </Styled.QRCodeQuantity>
        <Button
          width="100%"
          type="button"
          variant="primary"
          label={this.$t('save_and_download')}
          isLoading={this.isLoading}
          disable={this.isLoading}
          click={this.success}
        />
      </Styled.GeneratedContent>
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout
        closeModal={this.closeModal}
        title={!this.isGenerated && this.$t('generate_qr_code')}
      >
        <Styled.Content>
          {this.isGenerated ? this.renderGeneratedContent() : this.renderForm()}
        </Styled.Content>
      </modal-layout>
    );
  }
}
