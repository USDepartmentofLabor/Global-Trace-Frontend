import { Vue, Component, Prop } from 'vue-property-decorator';
import { get } from 'lodash';
import Button from 'components/FormUI/Button';
import { handleError } from 'components/Toast';
import { getTimePeriodOptions } from 'utils/cap';
import { RequestExtensionStatusEnum } from 'enums/brand';
import { approveRequestExtension, declineRequestExtension } from 'api/cap';
import { formatDate } from 'utils/date';
import * as Styled from './styled';

@Component
export default class ViewExtensionRequestModal extends Vue {
  @Prop({ required: true })
  readonly facilityId: string;
  @Prop({ default: null })
  readonly cap: CAP.CAP;
  @Prop({
    default: () => {
      // TODO
    },
  })
  onSuccess: () => void;

  private isSubmitting = false;

  get capId(): string {
    return this.cap.id;
  }

  get request(): CAP.RequestExtension {
    return this.cap.requestExtensions.find(
      ({ status }) => status === RequestExtensionStatusEnum.PENDING,
    );
  }

  get newTargetCompletionDate(): string {
    if (this.request) {
      return formatDate(this.request.targetCompletionAt);
    }
    return '';
  }

  get timePeriod(): string {
    if (this.request) {
      const options = getTimePeriodOptions();
      const timePeriod = options.find(
        ({ id }) => id === this.request.timePeriod,
      );
      return timePeriod.name;
    }
    return '';
  }

  get name(): string {
    return get(this.cap, 'facility.name');
  }

  closeModal(): void {
    this.$emit('close');
  }

  async decline(): Promise<void> {
    try {
      this.isSubmitting = true;
      await declineRequestExtension(this.facilityId, this.capId);
      this.onSuccess();
      this.$toast.success(
        this.$t('decline_request_successfully', { name: this.name }),
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

  async approve(): Promise<void> {
    try {
      this.isSubmitting = true;
      await approveRequestExtension(this.facilityId, this.capId);
      this.onSuccess();
      this.$toast.success(
        this.$t('approve_request_successfully', { name: this.name }),
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

  renderModalFooter(): JSX.Element {
    return (
      <Styled.Actions>
        <Button
          label={this.$t('decline_request')}
          variant="outlineDanger"
          click={this.decline}
          disabled={this.isSubmitting}
        />
        <Styled.ButtonGroupEnd>
          <Button
            label={this.$t('common.action.cancel')}
            variant="transparentPrimary"
            click={this.closeModal}
            disabled={this.isSubmitting}
          />
          <Button
            label={this.$t('approve_request')}
            click={this.approve}
            disabled={this.isSubmitting}
          />
        </Styled.ButtonGroupEnd>
      </Styled.Actions>
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout
        title={this.$t('view_extension_request')}
        closeModal={this.closeModal}
      >
        <Styled.Wrapper>
          <Styled.Row>
            <Styled.Group>
              <font-icon name="buildings" color="highland" size="20" />
              <Styled.Label>{this.$t('request_from')}</Styled.Label>
            </Styled.Group>
            <Styled.Value>{this.name}</Styled.Value>
          </Styled.Row>
          {this.newTargetCompletionDate && (
            <Styled.Row>
              <Styled.Group>
                <font-icon name="calendar" color="highland" size="20" />
                <Styled.Label>{this.$t('request_date')}</Styled.Label>
              </Styled.Group>
              <Styled.Value>{this.newTargetCompletionDate}</Styled.Value>
            </Styled.Row>
          )}

          <Styled.Row>
            <Styled.Group>
              <font-icon name="more_time" color="highland" size="20" />
              <Styled.Label>{this.$t('extension_period')}</Styled.Label>
            </Styled.Group>
            <Styled.Value>{this.timePeriod}</Styled.Value>
          </Styled.Row>
        </Styled.Wrapper>
        {this.renderModalFooter()}
      </modal-layout>
    );
  }
}
