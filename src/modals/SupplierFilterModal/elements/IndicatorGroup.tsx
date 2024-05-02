import { Vue, Component, Prop } from 'vue-property-decorator';
import { flatMap, forOwn, isEmpty, keys, omit, uniq } from 'lodash';
import Input from 'components/FormUI/Input';
import Checkbox from 'components/FormUI/Checkbox';
import Indicator from './Indicator';
import * as Styled from './styled';

@Component
export default class IndicatorGroup extends Vue {
  @Prop({ default: [] }) defaultValues: string[];
  @Prop({ default: [] }) issues: FacilityManagement.Issue[];
  @Prop({
    default: () => {
      //
    },
  })
  change: (indicatorIds: string[], subIndicatorIds: string[]) => void;

  private groupedIds: { [x: string]: string[] } = {};
  private search: string = '';
  private isSelectAll = true;

  get issueTotal(): number {
    let total = 0;
    this.issues.forEach(({ subIndicators }) => {
      total += subIndicators.length + 1;
    });
    return total;
  }

  created() {
    this.issues.forEach((issue) => {
      const values: string[] = this.defaultValues.filter((valueId) =>
        issue.subIndicators.some(({ id }) => valueId === id),
      );
      this.groupedIds[issue.indicator.id] = values;
    });
  }

  handleInputSearch(value: string): void {
    this.search = value;
  }

  onChange(groupId: string, parentValue: boolean, ids: string[]): void {
    if (!parentValue) {
      this.groupedIds = omit(this.groupedIds, groupId);
    } else {
      this.groupedIds[groupId] = ids;
    }
    this.change(this.getKeys(), this.getValueIds());
    this.$nextTick(() => {
      this.isSelectAll = this.issueTotal === this.defaultValues.length;
    });
  }

  getKeys(): string[] {
    const allIndicatorIds = keys(this.groupedIds).filter(
      (item) => !isEmpty(item),
    );
    return uniq(allIndicatorIds);
  }

  changeSelectAll(value: boolean) {
    if (this.isSelectAll !== value) {
      this.isSelectAll = !this.isSelectAll;
      if (this.isSelectAll) {
        const indicatorIds = flatMap(this.issues, 'indicator.id');
        let subIndicatorIds: string[] = [];
        this.issues.forEach(({ subIndicators }) => {
          const ids = flatMap(subIndicators, 'id');
          subIndicatorIds = [...subIndicatorIds, ...ids];
        });
        this.change(indicatorIds, subIndicatorIds);
      } else {
        this.change([], []);
      }
      this.$nextTick(() => {
        forOwn(this.$refs, (value, key) => {
          if (key.indexOf('indicator') > -1) {
            (value as App.Any).handleSetValues();
          }
        });
      });
    }
  }

  getValueIds(): string[] {
    let subIndicatorIds: string[] = [];
    forOwn(this.groupedIds, (value) => {
      if (!isEmpty(value)) {
        value = value.filter((item) => !isEmpty(item));
        subIndicatorIds = uniq([...subIndicatorIds, ...value]);
      }
    });
    return subIndicatorIds;
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <Input
          height="40px"
          name="search"
          size="large"
          value={this.search}
          placeholder={this.$t('search_for_indicator_sub_indicator')}
          changeValue={(value: string) => {
            this.handleInputSearch(value);
          }}
          prefixIcon="search"
          suffixIcon={this.search ? 'remove' : ''}
          clickSuffixIcon={() => this.handleInputSearch('')}
        />
        <Styled.SelectAll>
          <Checkbox
            value={this.isSelectAll}
            label={this.$t('select_all')}
            name="select_all"
            valueChange={this.changeSelectAll}
          />
        </Styled.SelectAll>
        <Styled.IndicatorList>
          {!isEmpty(this.issues) &&
            this.issues.map((issue, key) => (
              <Indicator
                ref={`indicators_${key}`}
                search={this.search}
                key={issue.indicator.id}
                defaultValues={this.defaultValues}
                indicator={issue.indicator}
                subIndicators={issue.subIndicators}
                change={(parentValue: boolean, values: string[]) =>
                  this.onChange(issue.indicator.id, parentValue, values)
                }
              />
            ))}
        </Styled.IndicatorList>
      </Styled.Wrapper>
    );
  }
}
