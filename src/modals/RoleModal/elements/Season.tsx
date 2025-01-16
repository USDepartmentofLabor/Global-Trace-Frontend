import { Vue, Component, Prop, Ref, PropSync } from 'vue-property-decorator';
import Input from 'components/FormUI/Input';
import DatePicker from 'components/FormUI/DatePicker';
import Duration from 'components/Duration';
import InputGroup from 'components/FormUI/InputGroup';
import { DATE_FORMAT } from 'config/constants';
import { InputType } from 'enums/app';
import * as Styled from './styled';

@Component
export default class Season extends Vue {
  @Ref('durationPopper') readonly durationPopperRef!: App.Any;
  @Prop({ default: '' }) formName: string;
  @Prop({ default: null }) seasonStartDate: Date;
  @PropSync('seasonDuration') seasonDurationValue!: number;

  @Prop({ default: false }) isSubmitting: boolean;
  @Prop() changeStartDate: (value: string) => void;
  @Prop() changeDuration: (value: number) => void;

  get formData(): RoleAndPermission.RoleParams {
    return this.$formulate.registry.get(this.formName).proxy;
  }

  durationChange(value: number): void {
    this.seasonDurationValue = value;
    this.changeDuration(value);
    if (this.durationPopperRef) {
      this.durationPopperRef.hide();
    }
  }

  renderSeasonDate(): JSX.Element {
    return (
      <DatePicker
        label={this.$t('season_start_date')}
        placeholder={this.$t('select_starting_date')}
        name="seasonStartDate"
        height="48px"
        type="date"
        value={this.seasonStartDate}
        selectDate={this.changeStartDate}
        disabled={this.isSubmitting}
        format={DATE_FORMAT}
      />
    );
  }

  renderSeasonDuration(): JSX.Element {
    return (
      <Styled.Row>
        <v-popover
          trigger="click"
          placement="bottom-end"
          container="body"
          openClass="overwrite-popper"
          autoHide
          ref="durationPopper"
        >
          <Input
            label={this.$t('season_duration')}
            name="seasonDuration"
            value={this.seasonDurationValue}
            type={InputType.NUMBER}
            width="100%"
            height="48px"
            placeholder={this.$t('season_duration_placeholder')}
            validation="bail|required|min:1|max:12"
            disabled={this.isSubmitting}
            changeValue={this.changeDuration}
            suffixIcon="history_black"
            validationMessages={{
              required: this.$t('validation.required', {
                field: this.$t('season_duration').toLowerCase(),
              }),
              max: this.$t('validation.max', {
                field: this.$t('season_duration'),
                number: 12,
              }),
              min: this.$t('validation.min', {
                field: this.$t('season_duration'),
                compare_field: 1,
              }),
            }}
          />
          <fragment slot="popover">
            <Duration
              duration={this.seasonDurationValue}
              changeValue={this.durationChange}
            />
          </fragment>
        </v-popover>
      </Styled.Row>
    );
  }

  render(): JSX.Element {
    return (
      <InputGroup column={2}>
        {this.renderSeasonDate()}
        {this.renderSeasonDuration()}
      </InputGroup>
    );
  }
}
