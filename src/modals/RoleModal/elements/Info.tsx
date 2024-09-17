/* eslint-disable max-lines, max-lines-per-function */
import { Vue, Component, Prop } from 'vue-property-decorator';
import moment from 'moment';
import { get, isEmpty, isNull, orderBy } from 'lodash';
import Dropdown from 'components/FormUI/Dropdown';
import Input from 'components/FormUI/Input';
import MessageError from 'components/FormUI/MessageError';
import { ChainOfCustodyEnum, RoleTypeEnum } from 'enums/role';
import Button from 'components/FormUI/Button';
import InputGroup from 'components/FormUI/InputGroup';
import IconDropdown from 'components/IconDropdown';
import { DATE_FORMAT, DEFAULT_ROLE_ICON } from 'config/constants';
import { YesNoEnum } from 'enums/brand';
import { roleIconsOptions } from 'utils/icon';
import * as Styled from './styled';
import Season from './Season';
import ChainOfCustody from './ChainOfCustody';

@Component
export default class Info extends Vue {
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({ default: false }) formData: RoleAndPermission.RoleParams;
  @Prop({ default: null })
  readonly role: RoleAndPermission.Role;
  @Prop({ default: false }) readonly isSubmitting: boolean;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  changeInput: () => void;
  @Prop() cancel: () => void;
  @Prop() next: (params: RoleAndPermission.RoleParams) => void;

  private typeSelected: App.DropdownOption = null;
  private rawSelected: App.DropdownOption = null;
  private iconSelected: App.DropdownOption = null;
  private seasonStartDate: Date = null;
  private seasonDuration: number = null;
  private chainOfCustody: ChainOfCustodyEnum = null;
  private isProductType: boolean = false;
  private formInput: RoleAndPermission.RoleParams = {
    isRawMaterialExtractor: null,
    seasonStartDate: '',
    seasonDuration: null,
    name: '',
    type: null,
    chainOfCustody: null,
    icon: '',
  };

  private typeOptions: App.DropdownOption[] = orderBy(
    [
      {
        id: RoleTypeEnum.ADMINISTRATOR,
        name: this.$t('administrator'),
      },
      {
        id: RoleTypeEnum.BRAND,
        name: this.$t('brand'),
      },
      {
        id: RoleTypeEnum.LABOR,
        name: this.$t('assessor'),
      },
      {
        id: RoleTypeEnum.PRODUCT,
        name: this.$t('producer'),
      },
      {
        id: RoleTypeEnum.API_USER,
        name: this.$t('API_user'),
      },
    ],
    'name',
    'asc',
  );
  private rawOptions: App.DropdownOption[] = [
    { name: this.$t('yes'), id: YesNoEnum.YES },
    {
      name: this.$t('no'),
      id: YesNoEnum.NO,
    },
  ];

  get isRawMaterialExtractor(): boolean {
    return get(this.rawSelected, 'id') === YesNoEnum.YES;
  }

  get isChainOfCustody(): boolean {
    return get(this.rawSelected, 'id') === YesNoEnum.NO;
  }

  get isValidRaw(): boolean {
    if (!this.isProductType) {
      return true;
    }
    if (this.isRawMaterialExtractor) {
      return !isNull(this.seasonStartDate) && !isNull(this.seasonDuration);
    }
    return !isEmpty(this.formInput.chainOfCustody);
  }

  created(): void {
    this.initData();
  }

  initData(): void {
    this.formInput = { ...this.formInput, ...this.formData };
    if (this.formInput.type) {
      const { name, type, icon } = this.formInput;
      this.formInput.name = name;
      this.formInput.type = type;
      const option = this.typeOptions.find(({ id }) => id === type);
      this.onChangeType(option, false);
      const iconValue = icon || DEFAULT_ROLE_ICON;
      this.changeIcon(roleIconsOptions.find(({ id }) => id === iconValue));
      this.initProductRaw();
    }
  }

  initProductRaw() {
    const {
      type,
      isRawMaterialExtractor,
      seasonDuration,
      seasonStartDate,
      chainOfCustody,
    } = this.formInput;
    if (type === RoleTypeEnum.PRODUCT) {
      const rawMaterialExtractor = isRawMaterialExtractor
        ? YesNoEnum.YES
        : YesNoEnum.NO;
      const rawOption = this.rawOptions.find(
        ({ id }) => id === rawMaterialExtractor,
      );
      this.changeRaw(rawOption);
      if (isRawMaterialExtractor) {
        this.changeSeasonStartDate(
          moment(seasonStartDate, DATE_FORMAT).format(),
        );
        this.changeSeasonDuration(seasonDuration);
      } else {
        this.changeChainOfCustody(chainOfCustody);
      }
    }
  }

  onChangeType(
    option: App.DropdownOption = null,
    shouldResetForm: boolean = true,
  ): void {
    this.typeSelected = option;
    this.formInput.type = option.id;
    this.isProductType = option.id === RoleTypeEnum.PRODUCT;
    if (shouldResetForm) {
      this.resetProductForm();
    }
  }

  changeChainOfCustody(value: ChainOfCustodyEnum = null): void {
    this.chainOfCustody = value;
    this.formInput.chainOfCustody = value;
  }

  changeSeasonStartDate(value: string = null) {
    this.seasonStartDate = value ? moment(value).toDate() : null;
    this.formInput.seasonStartDate = value
      ? moment(value).format(DATE_FORMAT)
      : null;
  }

  changeSeasonDuration(value: number = null) {
    this.seasonDuration = value;
    this.formInput.seasonDuration = value;
  }

  changeRaw(option: App.DropdownOption = null) {
    this.rawSelected = option;
    this.formInput.isRawMaterialExtractor = this.isRawMaterialExtractor;
  }

  changeIcon(option: App.DropdownOption) {
    this.iconSelected = option;
    this.formInput.icon = get(option, 'id', '') as string;
  }

  resetProductForm() {
    this.changeRaw();
    this.changeSeasonStartDate();
    this.changeSeasonDuration();
    this.changeChainOfCustody();
  }

  onSubmit() {
    this.next(this.formInput);
  }

  renderName(): JSX.Element {
    return (
      <Styled.Row>
        <Input
          label={this.$t('role_name')}
          name="name"
          height="48px"
          placeholder={this.$t('input_a_role_name')}
          validation="bail|required"
          changeValue={this.changeInput}
          autoTrim
          maxLength={255}
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('role_name').toLowerCase(),
            }),
          }}
        />
        {this.messageErrors && (
          <MessageError field="name" messageErrors={this.messageErrors} />
        )}
      </Styled.Row>
    );
  }

  renderType(): JSX.Element {
    return (
      <Dropdown
        title={this.$t('role_type')}
        placeholder={this.$t('select_one_of_the_role_type')}
        options={this.typeOptions}
        height="48px"
        trackBy="id"
        value={this.typeSelected}
        overflow
        allowEmpty={false}
        changeOptionValue={this.onChangeType}
      />
    );
  }

  renderIconDropdown(): JSX.Element {
    return (
      <IconDropdown
        value={get(this.iconSelected, 'id', DEFAULT_ROLE_ICON)}
        success={this.changeIcon}
      />
    );
  }

  renderRaw(): JSX.Element {
    return (
      <Dropdown
        title={this.$t('raw_material_extractor')}
        placeholder={this.$t('select_option')}
        options={this.rawOptions}
        height="48px"
        trackBy="id"
        value={this.rawSelected}
        overflow
        allowEmpty={false}
        changeOptionValue={this.changeRaw}
      />
    );
  }

  renderProductRaw(): JSX.Element {
    if (this.isProductType) {
      return (
        <fragment>
          {this.renderRaw()}
          {this.isRawMaterialExtractor && (
            <Season
              isSubmitting={this.isSubmitting}
              seasonStartDate={this.seasonStartDate}
              seasonDuration={this.seasonDuration}
              changeStartDate={this.changeSeasonStartDate}
              changeDuration={this.changeSeasonDuration}
            />
          )}
          {this.isChainOfCustody && (
            <ChainOfCustody
              value={this.chainOfCustody}
              change={this.changeChainOfCustody}
            />
          )}
        </fragment>
      );
    }
  }

  renderActions(hasError: boolean): JSX.Element {
    return (
      <Styled.Actions>
        <Styled.ButtonGroupEnd>
          <Button
            label={this.$t('common.action.cancel')}
            variant="outlinePrimary"
            click={this.cancel}
          />
          <Button
            variant="primary"
            label={this.$t('next')}
            isLoading={this.isSubmitting}
            disabled={this.isSubmitting || !this.isValidRaw || hasError}
            click={this.onSubmit}
          />
        </Styled.ButtonGroupEnd>
      </Styled.Actions>
    );
  }

  render(): JSX.Element {
    return (
      <formulate-form
        v-model={this.formInput}
        name="roleInfo"
        scopedSlots={{
          default: ({ hasErrors }: { hasErrors: boolean }) => (
            <Styled.FormContainer>
              <perfect-scrollbar>
                <Styled.Content>
                  <InputGroup>
                    {this.renderName()}
                    {this.renderType()}
                    {this.renderProductRaw()}
                    {this.renderIconDropdown()}
                  </InputGroup>
                </Styled.Content>
              </perfect-scrollbar>
              {this.renderActions(hasErrors)}
            </Styled.FormContainer>
          ),
        }}
      />
    );
  }
}
