import { Vue, Component, Prop } from 'vue-property-decorator';
import { get, isEmpty } from 'lodash';
import { formatDate, convertDateToTimestamp } from 'utils/date';
import DropdownMenu from 'components/DropdownMenu';
import * as Styled from './styled';

@Component
export default class FilterBox extends Vue {
  @Prop({ required: true }) readonly isMassBalance: boolean;
  @Prop({ default: null }) selectedDate: App.DropdownMenuOption;
  @Prop({ default: null }) selectedDateRange: Date[];
  @Prop({ default: [] }) dateOptions: App.DropdownMenuOption[];
  @Prop() changeDate: (value: string) => void;
  @Prop() changeDateRange: (value: Date[]) => void;
  @Prop() reset: () => void;

  get dateLabel(): string {
    return this.selectedDate ? this.selectedDate.name : this.$t('date');
  }

  get dateRangeLabel(): string {
    if (!isEmpty(this.selectedDateRange)) {
      const fromFormatted = formatDate(
        convertDateToTimestamp(this.selectedDateRange[0]),
      );
      const toFormatted = formatDate(
        convertDateToTimestamp(this.selectedDateRange[1]),
      );
      return `${fromFormatted} ~ ${toFormatted}`;
    }
    return this.$t('date');
  }

  get isEmptyDate(): boolean {
    return !isEmpty(this.selectedDate) || !isEmpty(this.selectedDateRange);
  }

  get filterDateColor(): string {
    return this.isEmptyDate ? 'envy' : 'spunPearl';
  }

  changeDateOption(option: App.DropdownMenuOption): void {
    this.changeDate(option.id);
  }

  onChangeDateRange(dateRange: Date[]): void {
    this.changeDateRange(dateRange);
  }

  renderDateOption(option: App.DropdownMenuOption): JSX.Element {
    const isActive = get(this.selectedDate, 'id') === option.id;
    return <Styled.Label isActive={isActive}>{option.name}</Styled.Label>;
  }

  renderCircleDate(): JSX.Element {
    return (
      <DropdownMenu
        width="232px"
        options={this.dateOptions}
        noResultText={this.$t('no_result')}
        allowSearch={true}
        selectOption={this.changeDateOption}
        scopedSlots={{
          menuOption: ({ option }: { option: App.DropdownMenuOption }) =>
            this.renderDateOption(option),
        }}
      >
        <Styled.FilterAction>
          <Styled.FilterText color={this.filterDateColor}>
            {this.dateLabel}
          </Styled.FilterText>
          <font-icon name="arrow_dropdown" color="spunPearl" size="18" />
        </Styled.FilterAction>
      </DropdownMenu>
    );
  }

  renderFilterContent(): JSX.Element {
    return (
      <Styled.FilterContent>{this.renderCircleDate()}</Styled.FilterContent>
    );
  }

  renderResetFilter(): JSX.Element {
    if (this.isEmptyDate) {
      return (
        <Styled.ResetFilter vOn:click={this.reset}>
          {this.$t('reset_filter')}
        </Styled.ResetFilter>
      );
    }
    return null;
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        {this.renderFilterContent()}
        {this.renderResetFilter()}
      </Styled.Wrapper>
    );
  }
}
