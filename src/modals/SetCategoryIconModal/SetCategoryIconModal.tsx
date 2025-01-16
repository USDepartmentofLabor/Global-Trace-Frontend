import { Component, Vue } from 'vue-property-decorator';
import { get, isEmpty, orderBy } from 'lodash';
import resources from 'config/resources';
import { getCategoryIcons } from 'utils/category-icon-helper';
import Button from 'components/FormUI/Button';
import SupplierLayout from 'components/Layout/SupplierLayout';
import { getCategoryIcon, updateCategoryIcon } from 'api/taxonomy-exploitation';
import { handleError } from 'components/Toast';
import { CategoryTypeEnum } from 'enums/taxonomy-exploitation';
import { SpinLoading } from 'components/Loaders';
import * as Styled from './styled';

const IconListModal = () => import('modals/IconListModal');

@Component
export default class SetCategoryIconModal extends Vue {
  private isLoading = true;
  private isSubmitting = false;
  private allIcons: TaxonomyManagement.CategoryIcon[] = [];
  private selectIcons: TaxonomyManagement.SettingIconCategory[] = [];

  get isDisabled() {
    return isEmpty(this.selectIcons);
  }

  get categoryIcons(): TaxonomyManagement.CategoryIcon[] {
    return orderBy(
      this.allIcons.filter(({ type }) => type === CategoryTypeEnum.CATEGORY),
      'name',
      'asc',
    );
  }

  get externalIcons(): TaxonomyManagement.CategoryIcon[] {
    return orderBy(
      this.allIcons.filter(
        ({ type }) => type === CategoryTypeEnum.EXTERNAL_RISK_INDICATOR,
      ),
      'name',
      'asc',
    );
  }

  get resourceIcons(): App.DropdownOption[] {
    return getCategoryIcons();
  }

  created() {
    this.initData();
  }

  async initData(): Promise<void> {
    try {
      this.isLoading = true;
      this.allIcons = await getCategoryIcon();
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  closeModal(): void {
    this.$emit('close');
  }

  async onSubmit(): Promise<void> {
    try {
      this.isSubmitting = true;
      await updateCategoryIcon({
        settingIconCategories: this.selectIcons,
      });
      this.closeModal();
      this.$toast.success(this.$t('successfully_saved'));
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isSubmitting = false;
    }
  }

  getIconSrc(iconId: string): string {
    const icon = this.resourceIcons.find(({ id }) => id === iconId);
    if (icon && icon.icon) {
      return get(resources, icon.icon, '');
    }
    return '';
  }

  openAssignIconModal(categoryIcon: TaxonomyManagement.CategoryIcon) {
    this.$modal.show(
      IconListModal,
      {
        categoryIcon,
        onSubmit: (iconId: string) => {
          this.onSelectIcon(categoryIcon, iconId);
        },
      },
      {
        name: 'IconListModal',
        width: '836px',
        height: 'auto',
        clickToClose: false,
      },
    );
  }

  onSelectIcon(categoryIcon: TaxonomyManagement.CategoryIcon, iconId: string) {
    const index = this.selectIcons.findIndex(
      ({ categoryId }) => categoryId === categoryIcon.id,
    );
    if (index > -1) {
      this.selectIcons[index].icon = iconId;
    } else {
      this.selectIcons.push({
        categoryId: categoryIcon.id,
        icon: iconId,
      });
    }
    const categoryIndex = this.allIcons.findIndex(
      ({ id }) => categoryIcon.id === id,
    );
    if (categoryIndex > -1) {
      this.allIcons[categoryIndex].icon = iconId;
    }
  }

  renderHeader(): JSX.Element {
    return (
      <Styled.Top>
        <Styled.Back onClick={this.closeModal}>
          <font-icon name="arrow_left" color="black" size="20" />
          {this.$t('set_category_icons')}
        </Styled.Back>
        <Button
          width="100%"
          label={this.$t('common.action.submit')}
          variant="primary"
          isLoading={this.isSubmitting}
          disabled={this.isDisabled || this.isSubmitting}
          click={this.onSubmit}
        />
      </Styled.Top>
    );
  }

  renderContent(categoryIcons: TaxonomyManagement.CategoryIcon[]): JSX.Element {
    return (
      <Styled.CategoryList>
        {categoryIcons.map((categoryIcon) => (
          <Styled.Category>
            <Styled.CategoryName>{categoryIcon.name}</Styled.CategoryName>
            {categoryIcon.icon && (
              <Styled.Icon
                domProps={{
                  src: this.getIconSrc(categoryIcon.icon),
                }}
                vOn:click={() => {
                  this.openAssignIconModal(categoryIcon);
                }}
              />
            )}
            {!categoryIcon.icon && (
              <Styled.AssignIcon
                vOn:click={() => {
                  this.openAssignIconModal(categoryIcon);
                }}
              >
                {this.$t('select_icon')}
              </Styled.AssignIcon>
            )}
          </Styled.Category>
        ))}
      </Styled.CategoryList>
    );
  }

  render(): JSX.Element {
    return (
      <SupplierLayout>
        {this.isLoading && <SpinLoading />}
        {!this.isLoading && (
          <Styled.Container>
            {this.renderHeader()}
            <Styled.Wrapper>
              <perfect-scrollbar>
                <Styled.Content>
                  {this.renderContent(this.categoryIcons)}
                  <Styled.CategoryType>
                    {this.$t('external_risk_indicators')}
                  </Styled.CategoryType>
                  {this.renderContent(this.externalIcons)}
                </Styled.Content>
              </perfect-scrollbar>
            </Styled.Wrapper>
          </Styled.Container>
        )}
      </SupplierLayout>
    );
  }
}
