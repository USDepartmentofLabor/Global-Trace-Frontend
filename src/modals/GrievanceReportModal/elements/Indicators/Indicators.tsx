import { Vue, Component, Prop } from 'vue-property-decorator';
import { get, map, orderBy } from 'lodash';
import { SortType } from 'enums/app';
import { severityToRiskLevel } from 'utils/risk-assessment';
import RiskAssessment from 'components/SupplierMap/RiskAssessment';
import * as Styled from './styled';

@Component
export default class Indicators extends Vue {
  @Prop({ required: true }) data: GrievanceReport.LaborRiskParams[];
  @Prop({ required: true }) isEmptyLaborRisk: boolean;
  @Prop({ default: false }) viewOnly: boolean;
  @Prop({ required: true }) toggleAddingLaborRisk: () => void;

  private laborRisks: GrievanceReport.LaborRiskParams[] = [];

  private filters: GrievanceReport.IndicatorsFilterParams = {
    category: SortType.ASC,
    indicator: SortType.ASC,
    subIndicator: SortType.DESC,
    severity: SortType.DESC,
  };

  private readonly filterItems = [
    {
      label: this.$t('category'),
      name: 'category',
    },
    {
      label: this.$t('indicator'),
      name: 'indicator',
    },
    {
      label: this.$t('sub_indicator'),
      name: 'subIndicator',
    },
    {
      label: this.$t('severity'),
      name: 'severity',
    },
  ];

  created() {
    this.laborRisks = this.data;
  }

  changeSortFilter(key: string): void {
    const order =
      get(this.filters, key) === SortType.ASC ? SortType.DESC : SortType.ASC;
    this.filters = {
      ...this.filters,
      [key]: order,
    };

    const productsOrder = orderBy(
      this.laborRisks,
      (item) => get(item, [key, 'name']),
      [get(this.filters, key)],
    );
    this.laborRisks = productsOrder;
  }

  renderFilter(): JSX.Element {
    return (
      <Styled.FilterContainer>
        {map(this.filterItems, ({ label, name }) => (
          <Styled.FilterWrapper
            key={name}
            sortType={get(this.filters, name)}
            vOn:click={() => this.changeSortFilter(name)}
          >
            <Styled.FilterContent>
              {label}
              <font-icon name="arrow_dropdown" size="24" />
            </Styled.FilterContent>
          </Styled.FilterWrapper>
        ))}
      </Styled.FilterContainer>
    );
  }

  renderSeverityValue(severity: App.DropdownOption): JSX.Element {
    const status = severityToRiskLevel(severity.value);
    return <RiskAssessment status={status} isBar />;
  }

  renderIndicators(): JSX.Element {
    return (
      <fragment>
        {this.laborRisks.map(
          ({ category, indicator, subIndicator, severity }, index) => (
            <Styled.List key={index}>
              <Styled.ListItem>{get(category, 'name', '-')}</Styled.ListItem>
              <Styled.ListItem>{get(indicator, 'name')}</Styled.ListItem>
              <Styled.ListItem>{get(subIndicator, 'name')}</Styled.ListItem>
              <Styled.ListItem>
                {this.renderSeverityValue(severity)}
              </Styled.ListItem>
            </Styled.List>
          ),
        )}
      </fragment>
    );
  }

  render(): JSX.Element {
    const label = this.isEmptyLaborRisk ? this.$t('plus') : this.$t('edit');
    const iconName = this.isEmptyLaborRisk ? 'plus' : 'edit';
    return (
      <Styled.Indicators>
        <Styled.Header>
          <Styled.Label>{this.$t('indicators')}</Styled.Label>
          {!this.viewOnly && (
            <Styled.Action vOn:click={this.toggleAddingLaborRisk}>
              <font-icon name={iconName} color="highland" size="16" />
              <Styled.Label>{label}</Styled.Label>
            </Styled.Action>
          )}
        </Styled.Header>
        <Styled.IndicatorInner>
          <Styled.IndicatorContent>
            {this.renderFilter()}
            {this.renderIndicators()}
          </Styled.IndicatorContent>
        </Styled.IndicatorInner>
      </Styled.Indicators>
    );
  }
}
