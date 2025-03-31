import { Component, Vue, Prop } from 'vue-property-decorator';
import { get, isEmpty, values } from 'lodash';
import { currentTimezone } from 'utils/date';
import { getQueryString } from 'utils/helpers';
import { getFacilityById } from 'api/brand-supplier';
import { handleError } from 'components/Toast';
import AppModule from 'store/modules/app';
import { getFacilityFilterValues } from 'api/facility-management';
import { getShortToken } from 'api/auth';
import { downloadFacilityDetailsPdfUrl } from 'utils/download-helper';
import FilterInformation from 'components/FilterInformation';
import { SpinLoading } from 'components/Loaders';
import { FilterKeysEnum } from 'enums/brand';
import * as Styled from './styled';
import InformationDetail from '../InformationDetail/InformationDetail';

const SupplierFilterModal = () => import('modals/SupplierFilterModal');

@Component
export default class ComplianceHistory extends Vue {
  @Prop({ default: '' }) private supplierId: string;
  @Prop({ default: null }) private topIssue: Auth.TopIssue;

  private isLoading: boolean = true;
  private isDownloading: boolean = false;
  private supplierData: Auth.Facility = null;
  private initFilterParams: FacilityManagement.FilterParams = {
    sources: [],
    categoryIds: [],
    indicatorIds: [],
    subIndicatorIds: [],
    fromTime: null,
    toTime: null,
  };
  private filterParams: FacilityManagement.FilterParams = {
    sources: [],
    categoryIds: [],
    indicatorIds: [],
    subIndicatorIds: [],
    fromTime: null,
    toTime: null,
  };
  private filterData: FacilityManagement.FilterValues = {
    sources: [],
    categories: [],
    issues: [],
    fromTime: null,
    toTime: null,
  };
  private filterValues: FacilityManagement.FilterValues = null;
  private currentCategoryId = '';
  private currentIndicatorId = '';
  private currentSubIndicatorId = '';

  get riskData(): Auth.RiskData {
    return get(this.supplierData, 'riskData');
  }

  get sourceData(): Auth.SupplierData[] {
    return get(this.riskData, 'data');
  }

  get hasFilter(): boolean {
    return values(this.filterParams).some((value) => !isEmpty(value));
  }

  get filterMapData(): FacilityManagement.FilterValues {
    if (!isEmpty(this.filterValues)) {
      this.filterData.categories = this.filterValues.categories.filter(
        (category) => this.filterParams.categoryIds.includes(category.id),
      );

      this.filterData.sources = this.filterValues.sources.filter((source) =>
        this.filterParams.sources.includes(source),
      );

      const issueMap = new Map(
        this.filterValues.issues.map((issue) => [issue.indicator.id, issue]),
      );

      this.filterData.issues = this.filterParams.indicatorIds
        .map((indicatorId) => issueMap.get(indicatorId))
        .filter(Boolean)
        .map((selectedIssue) => {
          const subIndicators = selectedIssue.subIndicators.filter(
            (subIndicator) =>
              this.filterParams.subIndicatorIds.includes(subIndicator.id),
          );
          return { ...selectedIssue, subIndicators };
        });

      this.filterData.fromTime = this.filterParams.fromTime;
      this.filterData.toTime = this.filterParams.toTime;
    }

    return this.filterData;
  }

  created(): void {
    if (this.supplierId) {
      this.getSupplierData();
      this.getSupplierFilterValues();
    }
  }

  async getSupplierData(isFirstLoading = true): Promise<void> {
    try {
      this.isLoading = isFirstLoading;
      this.supplierData = await getFacilityById(
        this.supplierId,
        this.filterParams,
      );
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  setCurrentRisk(
    categoryId: string,
    indicatorId: string,
    subIndicatorId: string,
  ) {
    this.currentCategoryId = categoryId;
    this.currentIndicatorId = indicatorId;
    this.currentSubIndicatorId = subIndicatorId;
  }

  refresh() {
    this.isLoading = true;
    this.$nextTick(() => {
      this.isLoading = false;
    });
  }

  onChangeFilter(filterParams: FacilityManagement.FilterParams): void {
    this.filterParams = filterParams;
    this.getSupplierData();
  }

  showFilterModal(): void {
    this.$modal.show(
      SupplierFilterModal,
      {
        id: this.supplierId,
        filterParams: this.filterParams,
        filterValues: this.filterValues,
        change: this.onChangeFilter,
      },
      {
        name: 'SupplierFilterModal',
        width: '991px',
        height: 'auto',
        clickToClose: false,
        adaptive: true,
      },
    );
  }

  async getSupplierFilterValues(): Promise<void> {
    try {
      this.filterValues = await getFacilityFilterValues(
        this.supplierId,
        this.filterParams,
      );
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  getDownloadQuery(shortToken: string): string {
    return getQueryString({
      shortToken,
      timezone: currentTimezone,
      language: AppModule.locale,
      ...this.filterParams,
    });
  }

  async onDownloadPdf(): Promise<void> {
    if (!this.isDownloading) {
      try {
        this.isDownloading = true;
        const response = await getShortToken();
        const downloadUrl = downloadFacilityDetailsPdfUrl(
          this.supplierId,
          this.getDownloadQuery(response.shortToken),
        );
        window.open(downloadUrl, '_blank');
      } catch (error) {
        handleError(error as App.ResponseError);
      } finally {
        this.isDownloading = false;
      }
    }
  }

  removeIndicatorFilterParams(value: string) {
    this.filterParams.indicatorIds = this.filterParams.indicatorIds.filter(
      (item) => item !== value,
    );
    const issue = this.filterValues.issues.find(
      ({ indicator }) => indicator.id === value,
    );
    if (issue) {
      this.filterParams.subIndicatorIds =
        this.filterParams.subIndicatorIds.filter((item) =>
          issue.subIndicators.every(({ id }) => id !== item),
        );
    }
  }

  removeFilterByKey(key: FilterKeysEnum, value?: string) {
    switch (key) {
      case FilterKeysEnum.Source:
        this.filterParams.sources = this.filterParams.sources.filter(
          (item) => item !== value,
        );
        break;
      case FilterKeysEnum.DateRange:
        this.filterParams.fromTime = null;
        this.filterParams.toTime = null;
        break;
      case FilterKeysEnum.Category:
        this.filterParams.categoryIds = this.filterParams.categoryIds.filter(
          (item) => item !== value,
        );
        break;
      case FilterKeysEnum.Indicator:
        this.removeIndicatorFilterParams(value);
        break;

      case FilterKeysEnum.SubIndicator:
        this.filterParams.subIndicatorIds =
          this.filterParams.subIndicatorIds.filter((item) => item !== value);
        break;
    }

    this.onChangeFilter(this.filterParams);
  }

  renderEmpty(): JSX.Element {
    return (
      <Styled.Empty>
        <Styled.EmptyImage />
        <Styled.EmptyText>
          {this.$t('there_is_no_items_to_show_in_this_view')}
        </Styled.EmptyText>
      </Styled.Empty>
    );
  }

  renderFilterAndDownload(): JSX.Element {
    const isEmptyData = isEmpty(this.sourceData) && !this.hasFilter;
    return (
      <Styled.FilterDownload isEnd={isEmptyData}>
        <Styled.Filter>
          {!isEmptyData && (
            <Styled.Action vOn:click={this.showFilterModal}>
              <font-icon name="view_list" color="highland" />
              {this.$t('filter')}
            </Styled.Action>
          )}
          {this.hasFilter && (
            <Styled.Clear
              vOn:click={() => this.onChangeFilter(this.initFilterParams)}
            >
              {this.$t('clear')}
              <font-icon name="remove" color="red" size="16" />
            </Styled.Clear>
          )}
        </Styled.Filter>

        <Styled.Action onClick={this.onDownloadPdf}>
          <font-icon name="download" color="highland" />
          <Styled.DownloadLabel>{this.$t('download')}</Styled.DownloadLabel>
        </Styled.Action>
      </Styled.FilterDownload>
    );
  }

  render(): JSX.Element {
    return (
      <fragment>
        {this.isLoading && <SpinLoading isInline={false} />}
        {this.renderFilterAndDownload()}
        {this.hasFilter && (
          <Styled.FilterDownload>
            <FilterInformation
              filterParams={this.filterMapData}
              removeFilterByKey={this.removeFilterByKey}
              isEdit
            />
          </Styled.FilterDownload>
        )}
        {isEmpty(this.sourceData) && this.renderEmpty()}
        {!this.isLoading && !isEmpty(this.sourceData) && (
          <InformationDetail
            facility={this.supplierData}
            sourceData={this.sourceData}
            topIssue={this.topIssue}
            currentCategoryId={this.currentCategoryId}
            currentIndicatorId={this.currentIndicatorId}
            currentSubIndicatorId={this.currentSubIndicatorId}
            setCurrentRisk={this.setCurrentRisk}
            addedCAP={async () => {
              await this.getSupplierData(false);
              this.refresh();
            }}
          />
        )}
      </fragment>
    );
  }
}
