import { Vue, Component, Prop } from 'vue-property-decorator';
import { flatMap, get, isEqual, orderBy } from 'lodash';
import Button from 'components/FormUI/Button';
import productModule from 'store/modules/product';
import supplyChain from 'store/modules/supply-chain';
import Dropdown from 'components/FormUI/Dropdown';
import { handleError } from 'components/Toast';
import { updateSupplyChainNodeMetadata } from 'api/supply-chain';
import * as Styled from './styled';

const ConfirmModal = () => import('modals/ConfirmModal');

@Component
export default class EditOutputProductModal extends Vue {
  @Prop({ required: true }) chainId: string;
  @Prop({ required: true }) currentNode: SupplyChain.Node;
  @Prop({ required: true }) reload: () => void;

  private isSubmitting = false;
  private outputProducts: App.DropdownOption[] = [];

  get isAddNew(): boolean {
    return this.currentNode.outputProductDefinitionIds.every((productId) =>
      this.outputProducts.some(({ id }) => id === productId),
    );
  }

  get isDisabled(): boolean {
    return isEqual(
      this.currentNode.outputProductDefinitionIds,
      flatMap(this.outputProducts, 'id'),
    );
  }

  get outputProductsOptions(): ProductManagement.Product[] {
    return orderBy(
      productModule.products,
      [(item) => item.name.toLowerCase()],
      'asc',
    );
  }

  created() {
    this.initData();
  }

  initData() {
    this.outputProducts = this.currentNode.outputProductDefinitionIds.map(
      (id) => {
        return productModule.products.find((product) => product.id === id);
      },
    );
  }

  async getImpactData(): Promise<void> {
    return new Promise((resolve) => {
      supplyChain.getUpdateImpactData({
        chainId: this.chainId,
        nodeId: this.currentNode.id,
        outputProductDefinitionIds: flatMap(this.outputProducts, 'id'),
        callback: {
          onFinish: () => {
            this.closeModal();
            resolve();
          },
        },
      });
    });
  }

  closeModal(): void {
    this.$emit('close');
  }

  changeOutputProducts(options: App.DropdownOption[]) {
    this.outputProducts = options;
  }

  async updateOutputProducts(): Promise<void> {
    try {
      this.isSubmitting = true;
      const outputProductDefinitionIds = flatMap(this.outputProducts, 'id');
      await updateSupplyChainNodeMetadata(this.currentNode.id, {
        outputProductDefinitionIds,
      });
      this.closeModal();
      this.reload();
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isSubmitting = false;
    }
  }

  showConfirmModal(): void {
    if (this.isAddNew) {
      this.updateOutputProducts();
    } else {
      this.$modal.show(
        ConfirmModal,
        {
          icon: 'warning_outline',
          iconSize: '60',
          iconColor: 'alizarinCrimson',
          message: this.$t('edit_product_outputs_title'),
          messagePosition: 'center',
          note: this.$t('edit_product_outputs_description'),
          confirmLabel: this.$t('preview_impact'),
          confirmButtonVariant: 'outlineDanger',
          cancelLabel: this.$t('common.action.cancel'),
          onConfirm: () => this.getImpactData(),
        },
        { width: '480px', height: 'auto', clickToClose: false, adaptive: true },
      );
    }
  }

  renderActions(): JSX.Element {
    return (
      <Styled.Actions>
        <Styled.ButtonGroupEnd>
          <Button
            type="button"
            variant="transparentPrimary"
            label={this.$t('common.action.cancel')}
            click={this.closeModal}
          />
          <Button
            variant="primary"
            icon="arrow_right"
            iconPosition="suffix"
            label={this.$t('common.action.save_changes')}
            disabled={this.isDisabled || this.isSubmitting}
            isLoading={this.isSubmitting}
            click={this.showConfirmModal}
          />
        </Styled.ButtonGroupEnd>
      </Styled.Actions>
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout
        title={this.$t('edit_product_outputs')}
        closeModal={this.closeModal}
      >
        <Styled.Wrapper>
          <Styled.Container>
            <Styled.Header>
              <Styled.Title>
                {this.$t('enter_product_outputs_for')}
              </Styled.Title>
              <Styled.Tag>{get(this.currentNode, 'role.name')}</Styled.Tag>
            </Styled.Header>
            <Dropdown
              title={this.$t('select_product_outputs')}
              options={this.outputProductsOptions}
              height="48px"
              trackBy="id"
              value={this.outputProducts}
              changeOptionValue={this.changeOutputProducts}
              placeholder={this.$t('select_product_outputs')}
              allowEmpty={false}
              overflow
              isMultiple
              limit={1}
              taggable
            />
          </Styled.Container>
          {this.renderActions()}
        </Styled.Wrapper>
      </modal-layout>
    );
  }
}
