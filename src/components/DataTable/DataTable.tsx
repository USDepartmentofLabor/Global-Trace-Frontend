import { Vue, Component, Prop } from 'vue-property-decorator';
import Paginate from './Paginate';
import ColGroup from './ColGroup';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import * as Styled from './styled';

@Component
export default class DataTable extends Vue {
  @Prop({ default: false }) readonly isCheckAll: boolean;
  @Prop({ default: false }) readonly hasAction: boolean;
  @Prop({ default: false }) readonly isLoading: boolean;
  @Prop({ default: null }) readonly sort: string;
  @Prop({ default: 'asc' }) readonly sortKey: string;
  @Prop({ required: true }) readonly columns: App.DataTableColumn[];
  @Prop() readonly pagination: App.DataTablePagination;
  @Prop({ required: true, type: Array }) readonly data: App.TableRow[];
  @Prop({ default: 10 }) readonly numberRowLoading: number;
  @Prop({
    default: 'default',
    validator(this, value) {
      return ['default', 'secondary', 'spaceBetweenRow'].includes(value);
    },
  })
  readonly variant: string;
  @Prop({ default: true }) readonly hasPagination: boolean;
  @Prop({
    default: () => {
      //
    },
  })
  pageOnChange: (page: number) => void;
  @Prop({
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

  get totalColumn(): number {
    return this.columns.length + (this.hasAction ? 1 : 0);
  }

  onChangePage(page: number): void {
    if (!this.isLoading) {
      this.pageOnChange(page);
    }
  }

  renderEmptyRow(): JSX.Element {
    return (
      <Styled.Tr>
        <Styled.Td colSpan={this.totalColumn}>
          {this.$slots.emptyRow || (
            <Styled.EmptyText>{this.$t('data_not_found')}</Styled.EmptyText>
          )}
        </Styled.Td>
      </Styled.Tr>
    );
  }

  renderPagination(): JSX.Element {
    return (
      <Styled.TableFooter isLoading={this.isLoading}>
        <Paginate
          forcePage={this.pagination.currentPage}
          pageCount={this.pagination.lastPage}
          isLoading={this.isLoading}
          pageRange={5}
          marginPages={0}
          isShowFirstLast
          pageOnChange={this.onChangePage}
          prevText=""
          nextText=""
          firstActionText=""
          lastActionText=""
        />
      </Styled.TableFooter>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <Styled.Inner>
          {this.$slots.tableHeader}
          <Styled.Table variant={this.variant}>
            <ColGroup hasAction={this.hasAction} columns={this.columns} />
            <TableHeader
              columns={this.columns}
              sort={this.sort}
              sortKey={this.sortKey}
              hasAction={this.hasAction}
              isLoading={this.isLoading}
              sortColumn={this.sortColumn}
              toggleCheckAll={this.toggleCheckAll}
              isCheckAll={this.isCheckAll}
              variant={this.variant}
            />
            <TableBody
              numberColumn={this.totalColumn}
              numberRowLoading={this.numberRowLoading}
              isLoading={this.isLoading}
              hasAction={this.hasAction}
              variant={this.variant}
            >
              {this.data.length
                ? this.data.map((item) => this.$scopedSlots.tableRow({ item }))
                : this.renderEmptyRow()}
            </TableBody>
          </Styled.Table>
        </Styled.Inner>
        {this.hasPagination && this.renderPagination()}
      </Styled.Wrapper>
    );
  }
}
