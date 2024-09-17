/* eslint-disable max-lines-per-function */
import { Component, Vue, Prop } from 'vue-property-decorator';
import { get, isEmpty, isNull } from 'lodash';
import AppModule from 'store/modules/app';
import { DEFAULT_LANGUAGE } from 'config/constants';
import { formatDate } from 'utils/date';
import { FilterKeysEnum } from 'enums/brand';
import * as Styled from './styled';

@Component
export default class FilterInformation extends Vue {
  @Prop({ required: true })
  readonly filterParams: FacilityManagement.FilterValues;
  @Prop({
    default: () => {
      //
    },
  })
  removeFilterByKey: (key: string, value?: string) => void;
  @Prop({ default: false }) readonly isEdit: boolean;

  get currentLocale(): string {
    return AppModule.locale;
  }

  get filterSources(): string[] {
    return get(this.filterParams, 'sources', []);
  }

  get filterCategories(): Auth.Category[] {
    return get(this.filterParams, 'categories', []);
  }

  get filterIssues(): FacilityManagement.Issue[] {
    return get(this.filterParams, 'issues', []);
  }

  getName(
    name: string,
    translation: {
      [x: string]: string;
    },
  ): string {
    return this.currentLocale === DEFAULT_LANGUAGE
      ? name
      : translation[this.currentLocale] || name;
  }

  renderRemoveTag(key: FilterKeysEnum, value?: string): JSX.Element {
    return (
      <Styled.CloseIcon vOn:click={() => this.removeFilterByKey(key, value)}>
        <font-icon name="remove" color="spunPearl" size="16" />
      </Styled.CloseIcon>
    );
  }

  renderSources(): JSX.Element {
    if (!this.isEdit) {
      const value = this.filterSources.join(', ');
      return (
        <Styled.PdfGroup>
          <Styled.PdfLabel>{this.$t('source')}</Styled.PdfLabel>
          <Styled.PdfValue>{value}</Styled.PdfValue>
        </Styled.PdfGroup>
      );
    }
    return (
      <Styled.FilterItem>
        <Styled.Label>{this.$t('source')}</Styled.Label>
        <Styled.List>
          {this.filterSources.map((item, index) => (
            <Styled.Item key={index}>
              {item}
              {this.renderRemoveTag(FilterKeysEnum.Source, item)}
            </Styled.Item>
          ))}
        </Styled.List>
      </Styled.FilterItem>
    );
  }

  renderDateRange(): JSX.Element {
    if (!this.isEdit) {
      return (
        <Styled.PdfGroup>
          <Styled.PdfLabel>{this.$t('date_range')}</Styled.PdfLabel>
          <Styled.PdfValue>
            {formatDate(this.filterParams.fromTime)} -{' '}
            {formatDate(this.filterParams.toTime)}
          </Styled.PdfValue>
        </Styled.PdfGroup>
      );
    }
    return (
      <Styled.FilterItem>
        <Styled.Label>{this.$t('date_range')}</Styled.Label>
        <Styled.List>
          <Styled.Item>
            {formatDate(this.filterParams.fromTime)} -
            {formatDate(this.filterParams.toTime)}
            {this.renderRemoveTag(FilterKeysEnum.DateRange)}
          </Styled.Item>
        </Styled.List>
      </Styled.FilterItem>
    );
  }

  renderCategories(): JSX.Element {
    if (!this.isEdit) {
      const value = this.filterCategories
        .map((item) => this.getName(item.name, item.translation))
        .join(', ');
      return (
        <Styled.PdfGroup>
          <Styled.PdfLabel>{this.$t('category')}</Styled.PdfLabel>
          <Styled.PdfValue>{value}</Styled.PdfValue>
        </Styled.PdfGroup>
      );
    }
    return (
      <Styled.FilterItem>
        <Styled.Label>{this.$t('category')}</Styled.Label>
        <Styled.List>
          {this.filterCategories.map((item, index) => (
            <Styled.Item key={index}>
              {this.getName(item.name, item.translation)}
              {this.renderRemoveTag(FilterKeysEnum.Category, item.id)}
            </Styled.Item>
          ))}
        </Styled.List>
      </Styled.FilterItem>
    );
  }

  renderSubIndicators(): JSX.Element {
    let subIndicators: Auth.Category[] = [];
    this.filterIssues.map((item) => {
      subIndicators = [...subIndicators, ...item.subIndicators];
    });

    if (!this.isEdit) {
      const value = subIndicators
        .map((item) => this.getName(item.name, item.translation))
        .join(', ');
      return (
        <Styled.PdfGroup>
          <Styled.PdfLabel>{this.$t('sub_indicator')}</Styled.PdfLabel>
          <Styled.PdfValue>{value}</Styled.PdfValue>
        </Styled.PdfGroup>
      );
    }
  }

  renderIndicators(): JSX.Element {
    const indicators: Auth.Category[] = [];
    this.filterIssues.map((item) => {
      indicators.push(item.indicator);
    });

    if (!this.isEdit) {
      const value = indicators
        .map((item) => this.getName(item.name, item.translation))
        .join(', ');
      return (
        <Styled.PdfGroup>
          <Styled.PdfLabel>{this.$t('indicator')}</Styled.PdfLabel>
          <Styled.PdfValue>{value}</Styled.PdfValue>
        </Styled.PdfGroup>
      );
    }

    return (
      <fragment>
        {!isEmpty(indicators) && (
          <Styled.FilterItem>
            <Styled.Label>{this.$t('indicator')}</Styled.Label>
            <Styled.List>
              {this.filterIssues.map((item, index) => (
                <Styled.Item key={index}>
                  {this.getName(
                    get(item, 'indicator.name', ''),
                    get(item, 'indicator.translation', ''),
                  )}
                  <span>({item.subIndicators.length})</span>
                  {this.renderRemoveTag(
                    FilterKeysEnum.Indicator,
                    get(item, 'indicator.id'),
                  )}
                </Styled.Item>
              ))}
            </Styled.List>
          </Styled.FilterItem>
        )}
      </fragment>
    );
  }

  renderContent(): JSX.Element {
    return (
      <fragment>
        {!isEmpty(this.filterSources) && this.renderSources()}
        {!isNull(get(this.filterParams, 'fromTime', null)) &&
          this.renderDateRange()}
        {!isEmpty(this.filterCategories) && this.renderCategories()}
        {!isEmpty(this.filterIssues) && this.renderIndicators()}
        {!isEmpty(this.filterIssues) && this.renderSubIndicators()}
      </fragment>
    );
  }

  render(): JSX.Element {
    return <Styled.Wrapper>{this.renderContent()}</Styled.Wrapper>;
  }
}
