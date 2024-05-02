/* eslint-disable max-lines */
import { Vue, Component, Prop } from 'vue-property-decorator';
import { get, isEmpty, orderBy } from 'lodash';
import { SeverityEnum } from 'enums/auditor';
import requestModule from 'store/modules/request';
import Dropdown from 'components/FormUI/Dropdown';
import Button from 'components/FormUI/Button';
import { SortType } from 'enums/app';
import * as Styled from './styled';
import { handleError } from '../Toast';

@Component
export default class IndicatorManagement extends Vue {
  @Prop({ default: false })
  readonly data: GrievanceReport.LaborRiskParams[];
  @Prop({
    default: () => {
      //
    },
  })
  change: (laborRisks: GrievanceReport.LaborRiskParams[]) => void;
  @Prop({
    default: () => {
      //
    },
  })
  back: () => void;

  private indicatorSelected: App.DropdownOption = null;
  private subIndicatorSelected: App.DropdownOption = null;
  private severitySelected: App.DropdownOption = null;
  private filters: GrievanceReport.IndicatorsFilterParams = {
    indicator: SortType.ASC,
    subIndicator: SortType.DESC,
    severity: SortType.DESC,
  };
  private laborRisks: GrievanceReport.LaborRiskParams[] = [];
  private isLoadingSubIndicator: boolean = false;
  private severityOptions: App.DropdownOption[] = [
    {
      name: this.$t('high'),
      value: SeverityEnum.HIGH.toString(),
    },
    {
      name: this.$t('medium'),
      value: SeverityEnum.MEDIUM.toString(),
    },
    {
      name: this.$t('low'),
      value: SeverityEnum.LOW.toString(),
    },
  ];

  get isDisableSubmit(): boolean {
    return (
      !this.indicatorSelected ||
      !this.subIndicatorSelected ||
      !this.severitySelected ||
      this.isDuplicated
    );
  }

  get laborRisksIds(): string[] {
    return this.laborRisks.map(({ indicator, subIndicator }) =>
      [indicator.id, subIndicator.id].join('|'),
    );
  }

  get currentLaborRiskId(): string {
    const indicatorValue = get(this.indicatorSelected, 'id', '');
    const subIndicatorValue = get(this.subIndicatorSelected, 'id', '');
    return [indicatorValue, subIndicatorValue].join('|');
  }

  get isDuplicated(): boolean {
    return this.laborRisksIds.includes(this.currentLaborRiskId);
  }

  get isDisableDone(): boolean {
    return isEmpty(this.laborRisks);
  }

  created() {
    this.laborRisks = this.data;
  }

  onChangeIndicator(option: App.DropdownOption = null): void {
    this.indicatorSelected = option;
    this.onChangeSubIndicator();
    this.getSubIndicators();
  }

  onChangeSubIndicator(option: App.DropdownOption = null): void {
    this.subIndicatorSelected = option;
  }

  onChangeSeverity(option: App.DropdownOption = null): void {
    this.severitySelected = option;
  }

  addLaborRisk(): void {
    this.laborRisks.push({
      indicator: this.indicatorSelected,
      subIndicator: this.subIndicatorSelected,
      severity: this.severitySelected,
    });
    this.onChangeIndicator();
    this.onChangeSubIndicator();
    this.onChangeSeverity();
  }

  getSubIndicators() {
    if (this.indicatorSelected) {
      this.isLoadingSubIndicator = true;
      requestModule.getSubIndicators({
        parentId: this.indicatorSelected.id as string,
        callback: {
          onFailure: (error: App.ResponseError) => {
            handleError(error);
          },
          onFinish: () => {
            this.isLoadingSubIndicator = false;
          },
        },
      });
    }
  }

  removeLaborRisk(index: number): void {
    this.laborRisks.splice(index, 1);
  }

  changeSortFilter(key: string): void {
    this.filters[key] =
      this.filters[key] === SortType.ASC ? SortType.DESC : SortType.ASC;
    const productsOrder = orderBy(
      this.laborRisks,
      (item) => item[key]['name'],
      [this.filters[key]],
    );
    this.laborRisks = productsOrder;
  }

  done() {
    this.change(this.laborRisks);
  }

  renderBackButton(): JSX.Element {
    return (
      <Styled.BackIcon>
        <font-icon
          name="arrow_left"
          color="highland"
          size="20"
          vOn:click_native={this.back}
        />
      </Styled.BackIcon>
    );
  }

  renderIndicator(): JSX.Element {
    return (
      <Styled.Row>
        <Dropdown
          title={this.$t('indicator')}
          options={requestModule.indicators}
          height="48px"
          variant="material"
          trackBy="id"
          value={this.indicatorSelected}
          changeOptionValue={this.onChangeIndicator}
          placeholder={this.$t('choose_indicators')}
          overflow
          allowEmpty={false}
        />
      </Styled.Row>
    );
  }

  renderSubIndicator(): JSX.Element {
    return (
      <Styled.Row>
        <Dropdown
          disabled={this.isLoadingSubIndicator}
          title={this.$t('sub_indicator')}
          options={requestModule.subIndicators}
          height="48px"
          variant="material"
          trackBy="id"
          value={this.subIndicatorSelected}
          changeOptionValue={this.onChangeSubIndicator}
          placeholder={this.$t('sub_indicator')}
          overflow
          allowEmpty={false}
        />
      </Styled.Row>
    );
  }

  renderSeverity(): JSX.Element {
    return (
      <Styled.Row>
        <Dropdown
          title={this.$t('severity')}
          options={this.severityOptions}
          height="48px"
          variant="material"
          value={this.severitySelected}
          changeOptionValue={this.onChangeSeverity}
          placeholder={this.$t('severity')}
          overflow
          allowEmpty={false}
        />
      </Styled.Row>
    );
  }

  renderForm(): JSX.Element {
    return (
      <Styled.AddIndicatorForm>
        {this.renderBackButton()}
        <Styled.AddIndicatorFormBody>
          {this.renderIndicator()}
          {this.renderSubIndicator()}
          {this.renderSeverity()}
        </Styled.AddIndicatorFormBody>
        <Styled.AddIndicatorAction>
          <Button
            label={this.$t('add')}
            disabled={this.isDisableSubmit}
            click={this.addLaborRisk}
          />
        </Styled.AddIndicatorAction>
      </Styled.AddIndicatorForm>
    );
  }

  renderFilter(): JSX.Element {
    return (
      <Styled.FilterContainer>
        <Styled.FilterWrapper
          sortType={this.filters.indicator}
          vOn:click={() => this.changeSortFilter('indicator')}
        >
          <Styled.FilterContent>
            {this.$t('indicator')}
            <font-icon name="arrow_dropdown" size="24" />
          </Styled.FilterContent>
        </Styled.FilterWrapper>
        <Styled.FilterWrapper
          sortType={this.filters.subIndicator}
          vOn:click={() => this.changeSortFilter('subIndicator')}
        >
          <Styled.FilterContent>
            {this.$t('sub_indicator')}
            <font-icon name="arrow_dropdown" size="24" />
          </Styled.FilterContent>
        </Styled.FilterWrapper>
        <Styled.FilterWrapper
          sortType={this.filters.severity}
          vOn:click={() => this.changeSortFilter('severity')}
        >
          <Styled.FilterContent>
            {this.$t('severity')}
            <font-icon name="arrow_dropdown" size="24" />
          </Styled.FilterContent>
        </Styled.FilterWrapper>
      </Styled.FilterContainer>
    );
  }

  renderSeverityValue(severity: App.DropdownOption): JSX.Element {
    const variant = SeverityEnum[severity.value];
    return (
      <Styled.Severity variant={variant.toLowerCase()}>
        {severity.name}
      </Styled.Severity>
    );
  }

  renderIndicators(): JSX.Element {
    return (
      <fragment>
        {this.laborRisks.map((item, index) => (
          <Styled.List key={index}>
            <Styled.ListItem>{item.indicator.name}</Styled.ListItem>
            <Styled.ListItem>{item.subIndicator.name}</Styled.ListItem>
            <Styled.ListItem>
              {this.renderSeverityValue(item.severity)}
            </Styled.ListItem>
            <Styled.ListItem>
              <font-icon
                name="remove"
                size="24"
                color="ghost"
                vOn:click_native={() => this.removeLaborRisk(index)}
              />
            </Styled.ListItem>
          </Styled.List>
        ))}
      </fragment>
    );
  }

  renderContent(): JSX.Element {
    return (
      <Styled.IndicatorInner>
        <Styled.IndicatorContent>
          {this.renderFilter()}
          {this.renderIndicators()}
        </Styled.IndicatorContent>
      </Styled.IndicatorInner>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.IndicatorWrapper>
        {this.renderForm()}
        {this.renderContent()}
        <Styled.Footer>
          <Button
            label={this.$t('done')}
            width="312px"
            disabled={this.isDisableDone}
            click={this.done}
          />
        </Styled.Footer>
      </Styled.IndicatorWrapper>
    );
  }
}
