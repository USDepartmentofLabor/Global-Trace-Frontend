import { Vue, Component, Prop } from 'vue-property-decorator';
import { get } from 'lodash';

@Component
export default class ColGroup extends Vue {
  @Prop({ default: [] }) readonly columns: App.DataTableColumn[];
  @Prop({ default: false }) readonly hasAction: boolean;

  getStyles = (column: App.DataTableColumn): {} => {
    const width = get(column, 'width');
    return width ? { width, minWidth: width } : {};
  };

  render(): JSX.Element {
    return (
      <colgroup>
        {this.hasAction && <col style={{ width: '10px' }} />}
        {this.columns.map((column, i) => (
          <col key={i.toString()} style={this.getStyles(column)} />
        ))}
      </colgroup>
    );
  }
}
