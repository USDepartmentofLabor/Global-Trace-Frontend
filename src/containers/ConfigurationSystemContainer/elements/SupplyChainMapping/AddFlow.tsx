import { Vue, Component, Prop } from 'vue-property-decorator';
import Button from 'components/FormUI/Button';
import * as Styled from './styled';

const SelectInitialRoleModal = () => import('modals/SelectInitialRoleModal');

@Component
export default class AddFlow extends Vue {
  @Prop({ required: true }) roles: RoleAndPermission.Role[];
  @Prop({ required: true }) productOutputs: ProductManagement.Product[];
  @Prop({
    default: () => {
      //
    },
  })
  addedFlow: (nodes: SupplyChain.Node[], callback: () => void) => void;
  @Prop({
    default: () => {
      //
    },
  })
  getFirstNodePosition: () => SupplyChain.NodePosition;

  handleAddFlow(): void {
    const position = this.getFirstNodePosition();
    this.$modal.show(
      SelectInitialRoleModal,
      {
        position,
        roles: this.roles,
        productOutputs: this.productOutputs,
        addedFlow: this.addedFlow,
      },
      { width: '640px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  render(): JSX.Element {
    return (
      <Styled.AddFlow>
        <Button
          variant="primary"
          label={this.$t('add_another_flow')}
          icon="plus"
          click={this.handleAddFlow}
        />
      </Styled.AddFlow>
    );
  }
}
