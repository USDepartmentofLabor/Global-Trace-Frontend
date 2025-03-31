import { Vue, Component, Prop } from 'vue-property-decorator';
import { flatMap, map } from 'lodash';
import productModule from 'store/modules/product';
import AppModule from 'store/modules/app';
import * as Styled from './styled';

@Component
export default class EditDownstreamSupplierModal extends Vue {
  @Prop({ required: true }) currentNode: SupplyChain.Node;
  @Prop({ required: true }) supplyChain: SupplyChain.SupplyChainMapping;
  @Prop({
    default: () => {
      //
    },
  })
  onSuccess: (relationIds: string[]) => Promise<void>;

  private deleteIds: string[] = [];

  get currentLocale(): string {
    return AppModule.locale;
  }

  get nodes(): SupplyChain.Node[] {
    const lines = flatMap(
      this.supplyChain.lines.filter(
        ({ fromNodeId }) => fromNodeId === this.currentNode.id,
      ),
      'toNodeId',
    );
    return this.supplyChain.nodes.filter(({ id }) => lines.includes(id));
  }

  closeModal(): void {
    this.$emit('close');
  }

  removeNode(nodeId: string) {
    const line = this.supplyChain.lines.find(
      ({ fromNodeId, toNodeId }) =>
        fromNodeId === this.currentNode.id && toNodeId === nodeId,
    );
    this.onSuccess([line.relation.id]);
    this.closeModal();
  }

  renderProduct(productId: string): JSX.Element {
    const product = productModule.products.find(({ id }) => id === productId);
    const name = product.nameTranslation[this.currentLocale] || product.name;
    return <Styled.Product>{name}</Styled.Product>;
  }

  renderNode(node: SupplyChain.Node): JSX.Element {
    if (!this.deleteIds.includes(node.id)) {
      return (
        <Styled.ListItem>
          <Styled.NodeInfo>
            <Styled.Name>{node.role.name}</Styled.Name>
            <Styled.ProductList>
              {node.outputProductDefinitionIds.map(this.renderProduct)}
            </Styled.ProductList>
          </Styled.NodeInfo>
          <Styled.Remove
            vOn:click={() => {
              this.removeNode(node.id);
            }}
          >
            <Styled.RemoveText>
              {this.$t('common.action.remove')}
            </Styled.RemoveText>
            <font-icon name="remove_circle_outline" size="16" color="manatee" />
          </Styled.Remove>
        </Styled.ListItem>
      );
    }
  }

  renderContent(): JSX.Element {
    return (
      <Styled.Content>
        <perfect-scrollbar>
          <Styled.List>
            {map(this.nodes, (node) => this.renderNode(node))}
          </Styled.List>
        </perfect-scrollbar>
      </Styled.Content>
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout
        closeModal={this.closeModal}
        title={this.$t('edit_downstream_suppliers')}
      >
        {this.renderContent()}
      </modal-layout>
    );
  }
}
