import { Vue, Component, Prop } from 'vue-property-decorator';
import Input from 'components/FormUI/Input';
import MessageError from 'components/FormUI/MessageError';
import * as Styled from './styled';

@Component
export default class QRCodeInfo extends Vue {
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  changeInput: () => void;

  keyDownInput(event: KeyboardEvent): void {
    const invalidChars = ['e', 'E'];
    if (invalidChars.includes(event.key)) {
      event.preventDefault();
    }
  }

  onPaste(event: ClipboardEvent): void {
    const isNumber = /^[0-9]+$/.test(event.clipboardData.getData('text'));
    if (!isNumber) {
      event.preventDefault();
    }
  }

  renderName(): JSX.Element {
    return (
      <Styled.Row>
        <Input
          label={this.$t('name')}
          name="name"
          placeholder={this.$t('QRCodeModal.name_placeholder')}
          validation="bail|required"
          disabled={this.disabled}
          changeValue={this.changeInput}
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('name').toLowerCase(),
            }),
          }}
        />
        {this.messageErrors && (
          <MessageError field="name" messageErrors={this.messageErrors} />
        )}
      </Styled.Row>
    );
  }

  renderQuantity(): JSX.Element {
    return (
      <Styled.Row>
        <Input
          label={this.$t('QRCodeModal.quantity')}
          name="quantity"
          placeholder={this.$t('QRCodeModal.quantity')}
          type="number"
          min="1"
          validation="bail|required"
          disabled={this.disabled}
          changeValue={this.changeInput}
          keyDownInput={this.keyDownInput}
          handlePaste={this.onPaste}
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('QRCodeModal.quantity').toLowerCase(),
            }),
          }}
        />
        {this.messageErrors && (
          <MessageError field="quantity" messageErrors={this.messageErrors} />
        )}
      </Styled.Row>
    );
  }

  render(): JSX.Element {
    return (
      <fragment>
        {this.renderName()}
        {this.renderQuantity()}
      </fragment>
    );
  }
}
