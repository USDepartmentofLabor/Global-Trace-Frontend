import { Vue, Component, Prop } from 'vue-property-decorator';
import { get, isEmpty, find } from 'lodash';
import Input from 'components/FormUI/Input/Input';
import MessageError from 'components/FormUI/MessageError/MessageError';
import AppModule from 'store/modules/app';
import {
  getInputCategoryName,
  getProductAttributeTypeName,
} from 'utils/translation';
import { InputAttributeEnum } from 'enums/app';
import { ProductAttributeTypeEnum } from 'enums/product';
import Dropdown from 'components/FormUI/Dropdown';
import Button from 'components/FormUI/Button/Button';
import {
  createAttribute,
  deleteAttribute,
  updateAttribute,
} from 'api/product-management';
import { handleError } from 'components/Toast';
import * as Styled from './styled';
import AttributeType from './AttributeType';

const ConfirmModal = () => import('modals/ConfirmModal');
@Component
export default class AttributeSetting extends Vue {
  @Prop({
    default: null,
  })
  currentAttribute: ProductManagement.ProductAttribute;
  @Prop({
    default: () => {
      //
    },
  })
  saved: (data: ProductManagement.ProductAttributeParams) => void;
  @Prop({
    default: () => {
      //
    },
  })
  deleted: () => void;

  private name = '';
  private category = '';
  private tagIds: string[] = [];
  private isLoading = false;
  private messageErrors: App.MessageError = null;
  private selectedType: App.DropdownOption = null;

  get selectedAttributeType(): ProductAttributeTypeEnum {
    return get(this.selectedType, 'id', null);
  }

  get attributeCategoryOptions(): ProductManagement.AttributeType[] {
    const options = Object.values(InputAttributeEnum).map((value) => ({
      id: value,
      label: getInputCategoryName(value),
    }));
    return options.filter(({ id }) => id !== InputAttributeEnum.UNIQUE_ID);
  }

  get attributeTypeOptions(): App.DropdownOption[] {
    return Object.values(ProductAttributeTypeEnum).map((value) => ({
      id: value,
      name: getProductAttributeTypeName(value),
    }));
  }

  get isDisabled(): boolean {
    return (
      isEmpty(this.name) ||
      isEmpty(this.category) ||
      (isEmpty(this.tagIds) &&
        (this.category === InputAttributeEnum.LIST ||
          this.category === InputAttributeEnum.NUMBER_UNIT_PAIR))
    );
  }

  get isEdit(): boolean {
    return !isEmpty(this.currentAttribute);
  }

  get currentLocale(): string {
    return AppModule.locale;
  }

  created() {
    if (this.isEdit) {
      const { name, type, options, category, nameTranslation } =
        this.currentAttribute;
      this.name = nameTranslation[this.currentLocale] || name;
      this.category = category;
      this.selectedType = find(
        this.attributeTypeOptions,
        (option) => option.id === type,
      );
      this.tagIds = options.map(
        ({ value, translation }) => translation[this.currentLocale] || value,
      );
    }
  }

  changeName(value: string): void {
    this.name = value;
  }

  onChangeCategory(value: string): void {
    this.category = value;
    if (this.isEdit) {
      this.onChangeTags(this.tagIds);
    } else {
      this.onChangeTags();
    }
  }

  onChangeTags(values: string[] = []): void {
    this.tagIds = values;
  }

  onChangeAttributeType(option: App.DropdownOption = null): void {
    this.selectedType = option;
    if (this.selectedAttributeType === ProductAttributeTypeEnum.PRODUCT_ID) {
      this.onChangeCategory(InputAttributeEnum.TEXT);
    }
    if (
      this.selectedAttributeType === ProductAttributeTypeEnum.PRODUCT_QUANTITY
    ) {
      this.onChangeCategory(InputAttributeEnum.NUMBER_UNIT_PAIR);
    }
  }

  async saveAttribute(): Promise<void> {
    try {
      this.isLoading = true;
      const params: ProductManagement.ProductAttributeParams = {
        name: this.name,
        category: this.category as InputAttributeEnum,
        type: get(this.selectedType, 'id', '') as ProductAttributeTypeEnum,
        options: this.tagIds.map((tag) => ({ value: tag })),
      };
      if (this.isEdit) {
        await updateAttribute(this.currentAttribute.id, params);
      } else {
        const attribute = await createAttribute(params);
        params.id = attribute.id;
        params.attribute = attribute;
      }
      this.$toast.success(this.$t('successfully_saved'));
      this.saved(params);
    } catch (error) {
      this.messageErrors = get(error, 'errors');
    } finally {
      this.isLoading = false;
    }
  }

  showConfirmDeleteModal(): void {
    this.$modal.show(
      ConfirmModal,
      {
        icon: 'delete_alt',
        iconSize: '44',
        message: this.$t('delete_attribute_message'),
        note: this.$t('this_action_cannot_be_undone'),
        confirmLabel: this.$t('common.action.yes_delete'),
        confirmButtonVariant: 'danger',
        cancelLabel: this.$t('common.action.cancel'),
        onConfirm: this.deleteAttribute,
      },
      { width: '367px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  async deleteAttribute(): Promise<void> {
    try {
      if (this.currentAttribute) {
        await deleteAttribute(this.currentAttribute.id);
      }
      this.$toast.success(this.$t('successfully_deleted'));
      this.deleted();
    } catch (error) {
      handleError(error as App.ResponseError);
      this.messageErrors = get(error, 'errors');
    }
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  renderInputName(): JSX.Element {
    return (
      <Styled.Input>
        <Input
          label={this.$t('name')}
          name="name"
          height="48px"
          value={this.name}
          placeholder={this.$t('input_attribute_name')}
          iconColor="highland"
          changeValue={(value: string) => {
            this.changeName(value);
            this.onClearMessageErrors();
          }}
          messageErrors={this.messageErrors}
        />
        {this.messageErrors && (
          <MessageError field="name" messageErrors={this.messageErrors} />
        )}
      </Styled.Input>
    );
  }

  renderAttributeType(): JSX.Element {
    return (
      <Dropdown
        title={this.$t('attribute_type')}
        height="48px"
        options={this.attributeTypeOptions}
        width="100%"
        value={this.selectedType}
        changeOptionValue={this.onChangeAttributeType}
        placeholder={this.$t('select_attribute_type')}
        allowEmpty={false}
        overflow
      />
    );
  }

  renderAttributeCategory(): JSX.Element {
    return (
      <fragment>
        <Styled.Title>{this.$t('attribute_category')}</Styled.Title>
        <Styled.List>
          {this.attributeCategoryOptions.map((option) => (
            <AttributeType
              key={option.id}
              tagIds={this.tagIds}
              value={this.category}
              selectedAttributeType={this.selectedAttributeType}
              type={option}
              changeType={this.onChangeCategory}
              changeTags={this.onChangeTags}
            />
          ))}
        </Styled.List>
      </fragment>
    );
  }

  renderActions(): JSX.Element {
    return (
      <Styled.Actions>
        {this.currentAttribute && (
          <Button
            type="button"
            variant="danger"
            label={this.$t('delete')}
            disabled={this.isLoading || this.isDisabled}
            click={this.showConfirmDeleteModal}
          />
        )}
        <Styled.ButtonGroupEnd>
          <Button
            type="button"
            variant="primary"
            label={
              this.isEdit
                ? this.$t('common.action.save_changes')
                : this.$t('add')
            }
            disabled={this.isLoading || this.isDisabled}
            click={this.saveAttribute}
          />
        </Styled.ButtonGroupEnd>
      </Styled.Actions>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <perfect-scrollbar>
          <Styled.Content>
            {this.renderInputName()}
            {this.renderAttributeType()}
            {this.renderAttributeCategory()}
          </Styled.Content>
        </perfect-scrollbar>
        {this.renderActions()}
      </Styled.Wrapper>
    );
  }
}
