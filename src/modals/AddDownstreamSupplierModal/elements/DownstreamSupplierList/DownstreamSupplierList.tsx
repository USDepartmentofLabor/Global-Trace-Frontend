import { Vue, Component, Prop } from 'vue-property-decorator';
import { flatMap, get } from 'lodash';
import { uuidv4 } from 'utils/helpers';
import Button from 'components/FormUI/Button';
import DownstreamSupplier from './DownstreamSupplier';
import * as Styled from './styled';

@Component
export default class DownstreamSupplierList extends Vue {
  @Prop({ required: true }) value: SupplyChain.DownstreamSupplierListParams[];
  @Prop({ required: true }) roleOptions: RoleAndPermission.Role[];
  @Prop({ required: true }) productOptions: ProductManagement.Product[];
  @Prop({ required: true }) currentNode: SupplyChain.Node;
  @Prop({ required: true }) change: (
    data: SupplyChain.DownstreamSupplierListParams[],
  ) => void;

  private data: SupplyChain.DownstreamSupplierListParams[] = [
    {
      id: uuidv4(),
      roleId: null,
      productOutputsIds: [],
    },
  ];

  addDownstreamSupplier() {
    this.data.push({
      id: uuidv4(),
      roleId: null,
      productOutputsIds: [],
    });
    this.change(this.data);
  }

  removeDownstreamSupplier(index: number) {
    this.data.splice(index, 1);
    this.change(this.data);
  }

  changeRole(index: number, option: App.DropdownOption): void {
    this.data[index].roleId = get(option, 'id') as string;
    this.change(this.data);
  }

  changeProductOutputs(index: number, options: App.DropdownOption[]): void {
    this.data[index].productOutputsIds = flatMap(options, 'id');
    this.change(this.data);
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <perfect-scrollbar>
          {this.data.map((value, index) => (
            <DownstreamSupplier
              index={index}
              value={value}
              list={this.data}
              key={value.id}
              roles={this.roleOptions}
              productOptions={this.productOptions}
              currentNode={this.currentNode}
              changeRole={(option: App.DropdownOption) => {
                this.changeRole(index, option);
              }}
              changeProductOutputs={(options: App.DropdownOption[]) => {
                this.changeProductOutputs(index, options);
              }}
              remove={() => {
                this.removeDownstreamSupplier(index);
              }}
            />
          ))}
        </perfect-scrollbar>

        <Button
          icon="add_box"
          variant="transparentPrimary"
          label={this.$t('add_additional_downstream_supplier')}
          click={this.addDownstreamSupplier}
        />
      </Styled.Wrapper>
    );
  }
}
