import { Vue, Component, Prop } from 'vue-property-decorator';
import { filter, flatMap, isEmpty } from 'lodash';
import requestModule from 'store/modules/request';
import Button from 'components/FormUI/Button';
import Dropdown from 'components/FormUI/Dropdown';
import InputGroup from 'components/FormUI/InputGroup';
import { handleError } from 'components/Toast';
import * as Styled from './styled';

@Component
export default class IndicatorFilterModal extends Vue {
  @Prop({ required: true }) filterParams: TaxonomyManagement.FilterParams;
  @Prop({
    default: () => {
      //
    },
  })
  onUpdate: (params: TaxonomyManagement.FilterParams) => Promise<void>;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  onClose: () => void;

  private categorySelected: App.DropdownOption[] = [];
  private indicatorSelected: App.DropdownOption[] = [];
  private subIndicatorSelected: App.DropdownOption[] = [];
  private isLoadingSubIndicator: boolean = false;

  created() {
    this.initData();
  }

  initData() {
    if (this.filterParams) {
      if (!isEmpty(this.filterParams.categoryIds)) {
        this.categorySelected = filter(requestModule.categories, ({ id }) =>
          this.filterParams.categoryIds.includes(id),
        );
      }
      if (!isEmpty(this.filterParams.indicatorIds)) {
        this.indicatorSelected = filter(requestModule.indicators, ({ id }) =>
          this.filterParams.indicatorIds.includes(id),
        );
      }
      if (!isEmpty(this.filterParams.subIndicatorIds)) {
        this.subIndicatorSelected = filter(
          requestModule.subIndicators,
          ({ id }) => this.filterParams.subIndicatorIds.includes(id),
        );
      }
    }
  }

  closeModal(): void {
    this.onClose();
    this.$emit('close');
  }

  onChangeCategory(value: App.DropdownOption[]): void {
    this.categorySelected = value;
  }

  onChangeIndicator(value: App.DropdownOption[]): void {
    this.indicatorSelected = value;
    this.onChangeSubIndicator();
    this.getSubIndicators();
  }

  getSubIndicators() {
    if (this.indicatorSelected) {
      this.isLoadingSubIndicator = true;
      requestModule.getSubIndicators({
        parentIds: flatMap(this.indicatorSelected, 'id'),
        callback: {
          onFailure: (error: App.ResponseError) => {
            handleError(error);
          },
          onFinish: () => {
            this.isLoadingSubIndicator = false;
          },
        },
      });
    }
  }

  onChangeSubIndicator(value: App.DropdownOption[] = []): void {
    this.subIndicatorSelected = value;
  }

  clear() {
    this.onUpdate(null);
    this.closeModal();
  }

  apply(): void {
    const categoryIds = flatMap(this.categorySelected, 'id');
    const indicatorIds = flatMap(this.indicatorSelected, 'id');
    const subIndicatorIds = flatMap(this.subIndicatorSelected, 'id');
    this.onUpdate({
      categoryIds: !isEmpty(categoryIds) ? categoryIds : undefined,
      indicatorIds: !isEmpty(indicatorIds) ? indicatorIds : undefined,
      subIndicatorIds: !isEmpty(subIndicatorIds) ? subIndicatorIds : undefined,
    });
    this.closeModal();
  }

  renderModalFooter(): JSX.Element {
    return (
      <Styled.Actions>
        <Styled.ButtonGroupEnd>
          <Button
            label={this.$t('clear_filter')}
            variant="transparentPrimary"
            click={this.clear}
          />
          <Button label={this.$t('common.action.apply')} click={this.apply} />
        </Styled.ButtonGroupEnd>
      </Styled.Actions>
    );
  }

  renderContent(): JSX.Element {
    return (
      <InputGroup>
        <Dropdown
          title={this.$t('category')}
          options={requestModule.categories}
          width="100%"
          height="48px"
          trackBy="id"
          value={this.categorySelected}
          changeOptionValue={this.onChangeCategory}
          placeholder={this.$t('all_category')}
          overflow
          isMultiple
          limit={1}
          taggable
        />
        <Dropdown
          title={this.$t('indicators')}
          options={requestModule.indicators}
          width="100%"
          height="48px"
          trackBy="id"
          value={this.indicatorSelected}
          changeOptionValue={this.onChangeIndicator}
          placeholder={this.$t('all_indicator')}
          overflow
          isMultiple
          limit={1}
          taggable
        />
        <Dropdown
          title={this.$t('sub_indicators')}
          options={requestModule.subIndicators}
          width="100%"
          height="48px"
          trackBy="id"
          value={this.subIndicatorSelected}
          changeOptionValue={this.onChangeSubIndicator}
          placeholder={this.$t('all_sub_indicator')}
          disabled={this.isLoadingSubIndicator}
          overflow
          isMultiple
          limit={1}
          taggable
        />
      </InputGroup>
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout title={this.$t('filter_by')} closeModal={this.closeModal}>
        <Styled.Content>
          {this.renderContent()}
          {this.renderModalFooter()}
        </Styled.Content>
      </modal-layout>
    );
  }
}
