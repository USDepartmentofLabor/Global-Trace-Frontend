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

  renderFilterTitle(): JSX.Element {
    return (
      <Styled.Title>{this.$t('the_filters_pdf_documents_title')}</Styled.Title>
    );
  }

  renderRemoveTag(key: FilterKeysEnum, value?: string): JSX.Element {
    return (
      <Styled.CloseIcon vOn:click={() => this.removeFilterByKey(key, value)}>
        <font-icon name="remove" color="spunPearl" size="16" />
      </Styled.CloseIcon>
    );
  }

  renderSources(): JSX.Element {
    return (
      <Styled.FilterItem>
        <Styled.Label>{this.$t('source')}</Styled.Label>
        <Styled.List>
          {this.filterSources.map((item, index) => (
            <Styled.Item key={index}>
              {item}
              {this.isEdit && this.renderRemoveTag(FilterKeysEnum.Source, item)}
            </Styled.Item>
          ))}
        </Styled.List>
      </Styled.FilterItem>
    );
  }

  renderDateRange(): JSX.Element {
    return (
      <Styled.FilterItem>
        <Styled.Label>{this.$t('date_range')}</Styled.Label>
        <Styled.List>
          <Styled.Item>
            {formatDate(this.filterParams.fromTime)} -
            {formatDate(this.filterParams.toTime)}
            {this.isEdit && this.renderRemoveTag(FilterKeysEnum.DateRange)}
          </Styled.Item>
        </Styled.List>
      </Styled.FilterItem>
    );
  }

  renderCategories(): JSX.Element {
    return (
      <Styled.FilterItem>
        <Styled.Label>{this.$t('category')}</Styled.Label>
        <Styled.List>
          {this.filterCategories.map((item, index) => (
            <Styled.Item key={index}>
              {this.getName(item.name, item.translation)}
              {this.isEdit &&
                this.renderRemoveTag(FilterKeysEnum.Category, item.id)}
            </Styled.Item>
          ))}
        </Styled.List>
      </Styled.FilterItem>
    );
  }

  renderIndicatorManager(): JSX.Element {
    const indicators: Auth.Category[] = [];
    let subIndicators: Auth.Category[] = [];

    this.filterIssues.map((item) => {
      indicators.push(item.indicator);
      subIndicators = [...subIndicators, ...item.subIndicators];
    });

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
                  {this.isEdit &&
                    this.renderRemoveTag(
                      FilterKeysEnum.Indicator,
                      get(item, 'indicator.id'),
                    )}
                </Styled.Item>
              ))}
            </Styled.List>
          </Styled.FilterItem>
        )}
        {!isEmpty(subIndicators) && !this.isEdit && (
          <Styled.FilterItem>
            <Styled.Label>{this.$t('sub_indicator')}</Styled.Label>
            <Styled.List>
              {subIndicators.map((item, index) => (
                <Styled.Item key={index}>
                  {this.getName(item.name, item.translation)}
                  {this.isEdit &&
                    this.renderRemoveTag(FilterKeysEnum.SubIndicator, item.id)}
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
        {!this.isEdit && this.renderFilterTitle()}
        {!isEmpty(this.filterSources) && this.renderSources()}
        {!isNull(get(this.filterParams, 'fromTime', null)) &&
          this.renderDateRange()}
        {!isEmpty(this.filterCategories) && this.renderCategories()}
        {this.renderIndicatorManager()}
      </fragment>
    );
  }

  render(): JSX.Element {
    return <Styled.Wrapper>{this.renderContent()}</Styled.Wrapper>;
  }
}
