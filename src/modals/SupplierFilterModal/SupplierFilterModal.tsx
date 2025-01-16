/* eslint-disable max-lines-per-function */
import { Vue, Component, Prop } from 'vue-property-decorator';
import moment from 'moment';
import { flatMap, isEmpty } from 'lodash';
import { convertDateToTimestamp } from 'utils/date';
import { convertUnixTimestampToDate } from 'utils/helpers';
import Button from 'components/FormUI/Button';
import DatePicker from 'components/FormUI/DatePicker';
import Dropdown from 'components/FormUI/Dropdown';
import InputGroup from 'components/FormUI/InputGroup';
import * as Styled from './styled';
import IndicatorGroup from './elements/IndicatorGroup';

@Component
export default class SupplierFilterModal extends Vue {
  @Prop({ required: true }) id: string;
  @Prop({ required: true }) filterParams: FacilityManagement.FilterParams;
  @Prop({ required: true }) filterValues: FacilityManagement.FilterValues;
  @Prop({ required: true }) change: (
    filterParams: FacilityManagement.FilterParams,
  ) => void;

  private isSubmitting: boolean = false;
  private selectedSources: App.DropdownOption[] = [];
  private selectedCategories: App.DropdownOption[] = [];
  private selectedDateRange: Date[] = [];
  private checkboxGroupIds: string[] = [];
  private indicatorIds: string[] = [];
  private subIndicatorIds: string[] = [];

  get isDisabledSubmit(): boolean {
    return this.isSubmitting;
  }

  get sourceOptions(): App.DropdownOption[] {
    return this.filterValues.sources.map((source) => ({
      id: source,
      name: source,
    }));
  }

  get categoryOptions(): App.DropdownOption[] {
    return this.filterValues.categories.map(({ id, name }) => ({
      id,
      name,
    }));
  }

  disabledDate(date: Date): boolean {
    const validDate = moment().toDate();
    return date > validDate;
  }

  created(): void {
    this.initData();
  }

  initData(): void {
    this.initSourceValues();
    this.initCategoryValues();
    this.initRange();
    this.initCheckboxGroup();
  }

  initSourceValues() {
    const values: App.DropdownOption[] = [];
    this.filterParams.sources.forEach((id) => {
      const source = this.sourceOptions.find((source) => source.id === id);
      if (source) {
        values.push({
          id,
          name: source.name,
        });
      }
    });
    this.changeSources(values);
  }

  initCategoryValues() {
    const values: App.DropdownOption[] = [];
    this.filterParams.categoryIds.forEach((id) => {
      const category = this.categoryOptions.find(
        (category) => category.id === id,
      );
      if (category) {
        values.push({
          id,
          name: category.name,
        });
      }
    });
    this.changeCategories(values);
  }

  initRange() {
    if (this.filterParams.fromTime && this.filterParams.toTime) {
      this.changeDateRange([
        convertUnixTimestampToDate(this.filterParams.fromTime),
        convertUnixTimestampToDate(this.filterParams.toTime),
      ]);
    }
  }

  initCheckboxGroup() {
    if (
      isEmpty(this.filterParams.indicatorIds) &&
      isEmpty(this.filterParams.subIndicatorIds)
    ) {
      this.indicatorIds = this.filterValues.issues.map(
        ({ indicator }) => indicator.id,
      );
      this.filterValues.issues.forEach(({ subIndicators }) => {
        this.subIndicatorIds = [
          ...this.subIndicatorIds,
          ...flatMap(subIndicators, 'id'),
        ];
      });
      this.checkboxGroupIds = [...this.indicatorIds, ...this.subIndicatorIds];
    } else {
      this.checkboxGroupIds = [
        ...this.filterParams.indicatorIds,
        ...this.filterParams.subIndicatorIds,
      ];
    }
  }

  changeSources(option: App.DropdownOption[] = []): void {
    this.selectedSources = option;
  }

  changeCategories(option: App.DropdownOption[] = []): void {
    this.selectedCategories = option;
  }

  changeDateRange(dateRange: Date[]): void {
    this.selectedDateRange = dateRange;
  }

  changeIndicatorGroup(
    indicatorIds: string[],
    subIndicatorIds: string[],
  ): void {
    this.indicatorIds = indicatorIds;
    this.subIndicatorIds = subIndicatorIds;
    this.checkboxGroupIds = [...indicatorIds, ...subIndicatorIds];
  }

  resetData() {
    this.selectedSources = [];
    this.selectedCategories = [];
    this.selectedDateRange = [];
    this.checkboxGroupIds = [];
    this.indicatorIds = [];
    this.subIndicatorIds = [];
  }

  changeFilter() {
    this.resetData();
    this.onApply();
  }

  onApply() {
    const sources = flatMap(this.selectedSources, 'id');
    const categoryIds = flatMap(this.selectedCategories, 'id');
    this.change({
      sources,
      categoryIds,
      indicatorIds: this.indicatorIds,
      subIndicatorIds: this.subIndicatorIds,
      fromTime:
        isEmpty(this.selectedDateRange) || !this.selectedDateRange[0]
          ? null
          : convertDateToTimestamp(this.selectedDateRange[0]),
      toTime:
        isEmpty(this.selectedDateRange) || !this.selectedDateRange[1]
          ? null
          : convertDateToTimestamp(this.selectedDateRange[1]),
    });
    this.closeModal();
  }

  closeModal(): void {
    this.$emit('close');
  }

  renderActions(): JSX.Element {
    return (
      <Styled.Actions>
        <Styled.ButtonGroupEnd>
          <Button
            label={this.$t('common.action.clear_filter')}
            variant="transparentPrimary"
            click={this.changeFilter}
          />
          <Button
            label={this.$t('common.action.apply')}
            variant="primary"
            disabled={this.isDisabledSubmit}
            click={this.onApply}
          />
        </Styled.ButtonGroupEnd>
      </Styled.Actions>
    );
  }

  renderForm(): JSX.Element {
    return (
      <Styled.Wrapper>
        <perfect-scrollbar>
          <Styled.Content>
            <InputGroup column={3}>
              <Dropdown
                title={this.$t('source')}
                options={this.sourceOptions}
                width="100%"
                height="48px"
                trackBy="id"
                value={this.selectedSources}
                changeOptionValue={this.changeSources}
                placeholder={
                  isEmpty(this.selectedSources) ? this.$t('select_all') : ''
                }
                overflow
                isMultiple
                limit={1}
                taggable
              />
              <Dropdown
                title={this.$t('category')}
                options={this.categoryOptions}
                width="100%"
                height="48px"
                trackBy="id"
                value={this.selectedCategories}
                changeOptionValue={this.changeCategories}
                placeholder={
                  isEmpty(this.selectedCategories) ? this.$t('select_all') : ''
                }
                overflow
                isMultiple
                limit={1}
                taggable
              />
              <DatePicker
                label={this.$t('date_range')}
                value={this.selectedDateRange}
                height="48px"
                placeholder={this.$t('select_date')}
                range
                disabledDate={this.disabledDate}
                selectDate={this.changeDateRange}
              />
            </InputGroup>
            {!isEmpty(this.filterValues.issues) && (
              <IndicatorGroup
                defaultValues={this.checkboxGroupIds}
                issues={this.filterValues.issues}
                change={this.changeIndicatorGroup}
              />
            )}
          </Styled.Content>
        </perfect-scrollbar>
        {this.renderActions()}
      </Styled.Wrapper>
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout title={this.$t('filter')} closeModal={this.closeModal}>
        {this.renderForm()}
      </modal-layout>
    );
  }
}
