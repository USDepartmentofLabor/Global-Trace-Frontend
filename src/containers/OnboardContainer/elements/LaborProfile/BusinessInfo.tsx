import { Vue, Component, Prop } from 'vue-property-decorator';
import Input from 'components/FormUI/Input';
import MessageError from 'components/FormUI/MessageError';
import * as Styled from './styled';

@Component
export default class BusinessInfo extends Vue {
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({ default: true }) readonly showBusinessRegisterNumber: boolean;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop({
    default: () => {
      //
    },
  })
  changeInput: () => void;

  renderBusinessName(): JSX.Element {
    return (
      <Styled.Column isFullWidth={!this.showBusinessRegisterNumber}>
        <Input
          height="48px"
          variant="material"
          label={this.$t('name')}
          name="businessName"
          placeholder={this.$t('name')}
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
      </Styled.Column>
    );
  }

  renderBusinessNumber(): JSX.Element {
    return (
      <Styled.Column>
        <Input
          height="48px"
          variant="material"
          label={this.$t('business_code')}
          name="businessRegisterNumber"
          placeholder={this.$t('business_code')}
          validation="bail|required"
          disabled={this.disabled}
          changeValue={this.changeInput}
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('business_code').toLowerCase(),
            }),
          }}
        />
        {this.messageErrors && (
          <MessageError
            field="businessRegisterNumber"
            messageErrors={this.messageErrors}
          />
        )}
      </Styled.Column>
    );
  }

  render(): JSX.Element {
    return (
      <fragment>
        {this.renderBusinessName()}
        {this.showBusinessRegisterNumber && this.renderBusinessNumber()}
      </fragment>
    );
  }
}
