import { Vue, Component, Prop } from 'vue-property-decorator';
import { isEmpty } from 'lodash';
import { getTimePeriodOptions } from 'utils/cap';
import Button from 'components/FormUI/Button';
import Dropdown from 'components/FormUI/Dropdown';
import { handleError } from 'components/Toast';
import { requestExtension } from 'api/cap';
import * as Styled from './styled';

@Component
export default class RequestExtensionModal extends Vue {
  @Prop({ required: true })
  readonly facilityId: string;
  @Prop({ required: true })
  readonly name: string;
  @Prop({ default: null })
  readonly capId: string;
  @Prop({
    default: () => {
      // TODO
    },
  })
  onSuccess: () => void;

  private isSubmitting = false;
  private selectedTime: App.DropdownOption = null;

  get isDisabledSubmit(): boolean {
    return this.isSubmitting || isEmpty(this.selectedTime);
  }

  get extensionTimeOptions(): App.DropdownOption[] {
    return getTimePeriodOptions();
  }

  closeModal(): void {
    this.$emit('close');
  }

  async onSubmit(): Promise<void> {
    try {
      this.isSubmitting = true;
      await requestExtension(this.facilityId, this.capId, {
        timePeriod: this.selectedTime.id,
      });
      this.onSuccess();
      this.$toast.success(
        this.$t('request_extension_successfully', { name: this.name }),
      );
      this.closeModal();
    } catch (error) {
      if (error) {
        handleError(error as App.ResponseError);
      }
    } finally {
      this.isSubmitting = false;
    }
  }

  changeSelectedTime(option: App.DropdownOption) {
    this.selectedTime = option;
  }

  renderModalFooter(): JSX.Element {
    return (
      <Styled.Actions>
        <Styled.ButtonGroupEnd>
          <Button
            label={this.$t('common.action.cancel')}
            variant="transparentPrimary"
            click={this.closeModal}
          />
          <Button
            label={this.$t('send_request')}
            click={this.onSubmit}
            disabled={this.isDisabledSubmit}
          />
        </Styled.ButtonGroupEnd>
      </Styled.Actions>
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout
        title={this.$t('request_extension')}
        closeModal={this.closeModal}
      >
        <Styled.Wrapper>
          <Dropdown
            title={this.$t('extension_time')}
            height="48px"
            options={this.extensionTimeOptions}
            width="100%"
            trackBy="id"
            value={this.selectedTime}
            changeOptionValue={this.changeSelectedTime}
            placeholder={this.$t('select_time_period')}
            disabled={this.isSubmitting}
            overflow
            allowEmpty={false}
          />
        </Styled.Wrapper>
        {this.renderModalFooter()}
      </modal-layout>
    );
  }
}
