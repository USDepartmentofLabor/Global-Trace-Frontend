/* eslint-disable max-lines */
import { Vue, Component, Prop } from 'vue-property-decorator';
import {
  some,
  isEmpty,
  map,
  find,
  groupBy,
  forOwn,
  filter,
  size,
} from 'lodash';
import CheckboxGroup from 'components/FormUI/Checkbox/CheckboxGroup';
import Checkbox from 'components/FormUI/Checkbox';
import RadioGroup from 'components/FormUI/Radio/RadioGroup';
import { GroupTypeEnum, PermissionActionEnum } from 'enums/role';
import * as Styled from './styled';

@Component
export default class PermissionsGroup extends Vue {
  @Prop({ default: [] }) defaultValues: string[];
  @Prop({ default: [] }) permissionGroup: RoleAndPermission.NewPermission;

  @Prop() setLogError: (name: string, hasError: boolean) => void;
  @Prop() change: (values: string[]) => void;

  private values: string[] = [];
  private value: string = null;
  private parentValue: boolean = false;
  private isOpen = false;
  private radioGroups: RoleAndPermission.RadioGroup[] = [];

  get isCheckbox(): boolean {
    return this.permissionGroup.groupType === GroupTypeEnum.CHECKBOX;
  }

  get isCheckboxGroup(): boolean {
    return this.permissionGroup.groupType === GroupTypeEnum.CHECKBOX_GROUP;
  }

  get isRadioMultipleGroup(): boolean {
    return (
      this.permissionGroup.groupType === GroupTypeEnum.RADIO_MULTIPLE_GROUP
    );
  }

  get isRadioGroup(): boolean {
    return this.permissionGroup.groupType === GroupTypeEnum.RADIO_GROUP;
  }

  get options(): App.DropdownOption[] {
    return this.permissionGroup.subPermissions.map(
      ({ id, name, description }) => ({
        value: id,
        label: name,
        description,
      }),
    );
  }

  get hasExpand(): boolean {
    return !isEmpty(this.permissionGroup.subPermissions);
  }

  get subPermissionIds(): string[] {
    return map(this.options, 'value');
  }

  created(): void {
    this.handleSetValues();
  }

  handleSetValues(): void {
    this.initCheckbox();
    this.initRadioMultipleGroups();
    this.initRadioGroup();
    this.initCheckboxGroup();
  }

  initCheckbox(): void {
    this.parentValue = some(
      this.defaultValues,
      (id: string) => id === this.permissionGroup.id,
    );
    if (this.isCheckbox) {
      this.setValues(this.defaultValues);
      this.onChangeCheckbox();
    }
  }

  initRadioMultipleGroups(): void {
    if (this.isRadioMultipleGroup) {
      const groupedSubPermissions = groupBy(
        this.permissionGroup.subPermissions,
        'label',
      );
      forOwn(
        groupedSubPermissions,
        (permissions: RoleAndPermission.Permission[], label: string) => {
          const value = this.defaultValues.find((value) =>
            permissions.find(({ id }) => id === value),
          );
          this.radioGroups.push({
            label,
            value: value || '',
            groupOptions: permissions.map(({ id, name }) => ({
              value: id,
              label: name,
            })),
          });
        },
      );
      this.onChangeRadioMultipleGroup();
    }
  }

  initCheckboxGroup(): void {
    if (this.isCheckboxGroup) {
      const values = filter(this.defaultValues, (id: string) =>
        some(this.options, (option: App.DropdownOption) => option.value === id),
      );
      this.setValues(values);
      this.onChangeCheckboxGroup();
    }
  }

  initRadioGroup(): void {
    if (this.isRadioGroup) {
      const subPermissionId = find(this.defaultValues, (id: string) =>
        some(this.options, (option: App.DropdownOption) => option.value === id),
      );
      this.setValue(subPermissionId);
      this.onChangeRadioGroup();
    }
  }

  setValue(value: string = null) {
    this.value = value;
  }

  setValues(values: string[]) {
    this.values = values;
  }

  changeCheckboxGroup(values: string[]) {
    this.setValues(values);
    if (!isEmpty(values)) {
      this.parentValue = true;
    }
    this.onChangeCheckboxGroup();
  }

  changeRadio(value: string) {
    if (value) {
      this.setValue(value);
      if (!this.parentValue) {
        this.parentValue = true;
      }
    }
    this.onChangeRadioGroup();
  }

  changeRadioGroup(index: number, value: string) {
    this.radioGroups[index].value = value;
    if (!this.parentValue) {
      this.parentValue = true;
    }
    this.onChangeRadioGroup();
  }

  changeRadioMultipleGroup(index: number, value: string) {
    this.radioGroups[index].value = value;
    if (!this.parentValue && !isEmpty(value)) {
      this.parentValue = true;
    }
    this.onChangeRadioMultipleGroup();
  }

  changeParentValue(value: boolean) {
    if (!value) {
      this.setValues([]);
    }
    this.parentValue = value;
    this.onChangeParent();
  }

  onChangeCheckboxGroup() {
    if (this.parentValue) {
      this.change([this.permissionGroup.id, ...this.values]);
    } else {
      this.change([]);
    }
  }

  onChangeRadioGroup() {
    if (this.parentValue) {
      this.change([this.permissionGroup.id, this.value]);
    } else {
      this.change([]);
    }
  }

  onChangeCheckbox() {
    if (this.parentValue) {
      this.change([this.permissionGroup.id]);
    } else {
      this.change([]);
    }
  }

  onChangeRadioMultipleGroup() {
    if (this.parentValue) {
      let radioGroups = this.radioGroups.filter(({ value }) => !isEmpty(value));
      if (isEmpty(radioGroups)) {
        radioGroups = this.getRadioGroupsDefault();
      }
      this.change([
        this.permissionGroup.id,
        ...radioGroups.map(({ value }) => value),
      ]);
    } else {
      this.change([]);
    }
  }

  getRadioGroupsDefault(): RoleAndPermission.RadioGroup[] {
    const result: RoleAndPermission.RadioGroup[] = [];
    const completeOwnProfilePermission =
      this.permissionGroup.subPermissions.find(
        ({ action }) => action === PermissionActionEnum.COMPLETE_OWN_PROFILE,
      );
    const noSAQPermission = this.permissionGroup.subPermissions.find(
      ({ action }) => action === PermissionActionEnum.NO_SAQ,
    );
    this.radioGroups.forEach((group) => {
      if (
        group.groupOptions.find(
          ({ value }) => value === completeOwnProfilePermission.id,
        )
      ) {
        group.value = completeOwnProfilePermission.id;
        result.push(group);
      }
      if (
        group.groupOptions.find(({ value }) => value === noSAQPermission.id)
      ) {
        group.value = noSAQPermission.id;
        result.push(group);
      }
    });
    return result;
  }

  onChangeParent() {
    if (this.isCheckbox) {
      this.onChangeCheckbox();
    } else if (this.isRadioGroup) {
      this.onChangeRadioGroup();
    } else if (this.isCheckboxGroup) {
      this.onChangeCheckboxGroup();
    } else if (this.isRadioMultipleGroup) {
      this.onChangeRadioMultipleGroup();
    }
  }

  onToggle() {
    if (this.hasExpand) {
      this.isOpen = !this.isOpen;
    }
  }

  renderRadioMultipleGroup(): JSX.Element {
    return (
      <Styled.PermissionList>
        {this.radioGroups.map(({ label, value, groupOptions }, index) => (
          <fragment key={index}>
            {size(this.radioGroups) > 1 && <Styled.Label>{label}</Styled.Label>}
            <RadioGroup
              value={value}
              name={label}
              options={groupOptions}
              label={label}
              changeValue={(value: string) =>
                this.changeRadioMultipleGroup(index, value)
              }
            />
          </fragment>
        ))}
      </Styled.PermissionList>
    );
  }

  renderRadioGroup(): JSX.Element {
    return (
      <RadioGroup
        name={this.permissionGroup.id}
        value={this.value}
        options={this.options}
        changeValue={this.changeRadio}
      />
    );
  }

  renderCheckboxGroup(): JSX.Element {
    return (
      <CheckboxGroup
        name={this.permissionGroup.id}
        values={this.values}
        options={this.options}
        changeValue={this.changeCheckboxGroup}
      />
    );
  }

  render(): JSX.Element {
    return (
      <Styled.CheckboxGroup>
        <Styled.CheckboxWrapper vOn:click={this.onToggle}>
          <Checkbox
            value={this.parentValue}
            label={this.permissionGroup.name}
            name={this.permissionGroup.name}
            valueChange={this.changeParentValue}
          />
          {this.hasExpand && (
            <Styled.ExpandIcon isOpen={this.isOpen}>
              <font-icon name="expand_more" size="20" color="abbey" />
            </Styled.ExpandIcon>
          )}
        </Styled.CheckboxWrapper>
        {this.isOpen && (
          <Styled.CheckboxGroupWrapper>
            {this.isCheckboxGroup && this.renderCheckboxGroup()}
            {this.isRadioGroup && this.renderRadioGroup()}
            {this.isRadioMultipleGroup && this.renderRadioMultipleGroup()}
          </Styled.CheckboxGroupWrapper>
        )}
      </Styled.CheckboxGroup>
    );
  }
}
