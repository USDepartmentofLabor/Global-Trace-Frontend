import { Vue, Component, Prop } from 'vue-property-decorator';
import { get } from 'lodash';
import Button from 'components/FormUI/Button';
import { getCategoryIcons } from 'utils/category-icon-helper';
import resources from 'config/resources';
import * as Styled from './styled';

@Component
export default class IconListModal extends Vue {
  @Prop({ required: true })
  readonly categoryIcon: TaxonomyManagement.CategoryIcon;
  @Prop({ required: true }) onSubmit: (selectIcon: string) => void;

  private selectedIcon: string = '';

  created() {
    this.selectedIcon = get(this.categoryIcon, 'icon', '');
  }

  closeModal(): void {
    this.$emit('close');
  }

  setIcon(iconId: string = null) {
    this.selectedIcon = iconId;
  }

  done() {
    this.onSubmit(this.selectedIcon);
    this.closeModal();
  }

  renderIcons(): JSX.Element {
    const icons = getCategoryIcons();
    return (
      <Styled.Icons>
        <Styled.Icon isSelected={!this.selectedIcon}>
          <Styled.NoIcon
            vOn:click={() => {
              this.setIcon();
            }}
          >
            {this.$t('no_icon')}
          </Styled.NoIcon>
        </Styled.Icon>
        {icons.map((icon) => (
          <Styled.Icon
            isSelected={this.selectedIcon === icon.id}
            vOn:click={() => {
              this.setIcon(icon.id as string);
            }}
          >
            <Styled.Image
              domProps={{
                src: get(resources, icon.icon, ''),
              }}
            />
          </Styled.Icon>
        ))}
      </Styled.Icons>
    );
  }

  renderActions(): JSX.Element {
    return (
      <Styled.Actions>
        <Button
          label={this.$t('common.action.cancel')}
          variant="outlinePrimary"
          width="100%"
          click={this.closeModal}
        />
        <Button
          variant="primary"
          label={this.$t('done')}
          width="100%"
          click={this.done}
        />
      </Styled.Actions>
    );
  }
  render(): JSX.Element {
    return (
      <modal-layout closeModal={this.closeModal} title={this.categoryIcon.name}>
        <Styled.Wrapper>
          {this.renderIcons()}
          {this.renderActions()}
        </Styled.Wrapper>
      </modal-layout>
    );
  }
}
