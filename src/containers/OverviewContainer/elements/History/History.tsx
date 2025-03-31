import { Vue, Component, Prop } from 'vue-property-decorator';
import DataTable from 'components/DataTable';
import Transaction from './Transaction';
import * as Styled from './styled';

@Component
export default class History extends Vue {
  @Prop({ required: true }) transactions: TransactionHistory.History[];
  @Prop({ default: false }) isLoadingTransactionList: boolean;
  @Prop({ default: false }) hasPagination: boolean;
  @Prop({ required: true }) pagination: App.Pagination;
  @Prop({ required: true }) changePage: () => void;

  render(): JSX.Element {
    return (
      <Styled.Table>
        <DataTable
          numberRowLoading={5}
          isLoading={this.isLoadingTransactionList}
          columns={[]}
          data={this.transactions}
          hasPagination={this.hasPagination}
          pagination={this.pagination}
          pageOnChange={this.changePage}
          scopedSlots={{
            tableRow: ({ item }: { item: TransactionHistory.History }) => (
              <Transaction history={item} />
            ),
          }}
        />
      </Styled.Table>
    );
  }
}
