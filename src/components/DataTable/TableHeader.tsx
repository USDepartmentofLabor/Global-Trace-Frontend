import { Vue, Component, Prop } from 'vue-property-decorator';
import Checkbox from 'components/FormUI/Checkbox/Checkbox';
import icons from 'assets/data/icons.json';
import * as Styled from './styled';

@Component
export default class TableHeader extends Vue {
  @Prop({ default: [] }) readonly columns: App.DataTableColumn[];
  @Prop({ default: null }) readonly sort: string;
  @Prop({ default: null }) readonly sortKey: string;
  @Prop({ default: false }) readonly hasAction: boolean;
  @Prop({ default: false }) readonly isLoading: boolean;
  @Prop({ default: false }) readonly variant: boolean;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  sortColumn: (key: string, type: string) => void;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  toggleCheckAll: (isCheckAll: boolean) => void;
  @Prop({ default: false }) readonly isCheckAll: boolean;

  private sortDefault: string;
  private sortKeyDefault: string;

  created(): void {
    this.sortDefault = this.sort;
    this.sortKeyDefault = this.sortKey;
  }

  getCurrentSort(column: App.DataTableColumn): null | string {
    if (column.sortable) {
      if (this.sortKeyDefault === column.sortKey) {
        if (this.sortDefault === 'asc') {
          return 'asc';
        }
        return 'desc';
      }
    }
    return null;
  }

  onSortChange(column: App.DataTableColumn): void {
    if (!this.isLoading) {
      if (column.sortable) {
        const sortType =
          this.sortKeyDefault === column.sortKey && this.sortDefault === 'asc'
            ? 'desc'
            : 'asc';
        this.sortDefault = sortType;
        this.sortKeyDefault = column.sortKey;
        this.$forceUpdate();
        this.sortColumn(this.sortKeyDefault, this.sortDefault);
      }
    }
  }

  onToggle(event: Event): void {
    event.preventDefault();
    this.toggleCheckAll(!this.isCheckAll);
  }

  render(): JSX.Element {
    return (
      <Styled.Thead variant={this.variant}>
        <Styled.Tr>
          {this.hasAction && (
            <Styled.Th type="action">
              <Checkbox
                toggleCheckbox={this.onToggle}
                checked={this.isCheckAll}
                name="check"
                size="small"
              />
            </Styled.Th>
          )}
          {this.columns.map((column, idx) => (
            <Styled.Th
              key={idx.toString()}
              disabled={this.isLoading}
              onClick={() => this.onSortChange(column)}
            >
              <Styled.ThLabel
                sortable={column.sortable}
                sort={this.getCurrentSort(column)}
                icon={icons.chevron_right}
              >
                {column.label}
              </Styled.ThLabel>
            </Styled.Th>
          ))}
        </Styled.Tr>
      </Styled.Thead>
    );
  }
}
