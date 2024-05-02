/* eslint-disable max-lines */
import { Component, Vue, Prop } from 'vue-property-decorator';
import { get, head, isEmpty, values } from 'lodash';
import { currentTimezone } from 'utils/date';
import { getBusinessLocation, getQueryString } from 'utils/helpers';
import { getFacilityById } from 'api/brand-supplier';
import { handleError } from 'components/Toast';
import { DEFAULT_LANGUAGE } from 'config/constants';
import AppModule from 'store/modules/app';
import { getFacilityFilterValues } from 'api/facility-management';
import { getShortToken } from 'api/auth';
import { downloadFacilityDetailsPdfUrl } from 'utils/download-helper';
import RiskCard from 'components/RiskCard';
import { SpinLoading } from 'components/Loaders';
import FilterInformation from 'components/FilterInformation';
import { FilterKeysEnum } from 'enums/brand';
import * as Styled from './styled';
import InformationDetail from './elements/InformationDetail/InformationDetail';

const SupplierFilterModal = () => import('modals/SupplierFilterModal');

@Component
export default class SupplierDetails extends Vue {
  @Prop({ default: '' }) private supplierId: string;
  @Prop({
    default: () => {
      //
    },
  })
  close: () => void;

  private isShow: boolean = false;
  private isLoading: boolean = false;
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

  get risks(): Auth.ViewRisk[] {
    return [
      {
        title: this.$t('overall_risk'),
        risk: this.overallRisk,
      },
      {
        title: this.$t('country_risk'),
        risk: this.countryRisk,
      },
    ];
  }

  get information(): App.Any[] {
    return [
      {
        icon: 'buildings',
        title: this.$t('type'),
        value: get(this.supplierDetailType, 'name', ''),
        isBig: true,
      },
      {
        icon: 'phone_call',
        value: this.phone,
      },

      {
        icon: 'note',
        title: this.$t('business_reg_no'),
        value: this.businessRegisterNumber,
        isBig: true,
      },
      {
        icon: 'map_pin',
        value: this.address,
      },
      {
        icon: 'globe',
        value: this.country,
      },
    ];
  }

  get currentLocale(): string {
    return AppModule.locale;
  }

  get name(): string {
    return get(this.supplierData, 'name', '');
  }

  get riskData(): Auth.RiskData {
    return get(this.supplierData, 'riskData');
  }

  get overallRisk(): Auth.Risk {
    return get(this.riskData, 'overallRisk');
  }

  get countryRisk(): Auth.Risk {
    return get(this.riskData, 'countryRisk');
  }

  get supplierDetailType(): Auth.SupplierType {
    return get(this.supplierData, 'type');
  }

  get supplierUsers(): Auth.User[] {
    return get(this.supplierData, 'users');
  }

  get phone(): string {
    return get(head(this.supplierUsers), 'phoneNumber');
  }

  get businessRegisterNumber(): string {
    return get(this.supplierData, 'businessRegisterNumber', '');
  }

  get address(): string {
    return getBusinessLocation(this.supplierData);
  }

  get country(): string {
    const translation = get(this.supplierData, 'country.translation');
    const countryName = get(this.supplierData, 'country.country', '');

    return this.currentLocale === DEFAULT_LANGUAGE
      ? countryName
      : translation?.[this.currentLocale] || countryName;
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

  async getSupplierData(): Promise<void> {
    try {
      this.isLoading = true;
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
        this.filterParams.indicatorIds = this.filterParams.indicatorIds.filter(
          (item) => item !== value,
        );
        break;
      case FilterKeysEnum.SubIndicator:
        this.filterParams.subIndicatorIds =
          this.filterParams.subIndicatorIds.filter((item) => item !== value);
        break;
    }

    this.onChangeFilter(this.filterParams);
  }

  handleClose() {
    this.isShow = false;
    setTimeout(() => {
      this.close();
    }, 100);
  }

  mounted() {
    setTimeout(() => {
      this.isShow = true;
    });
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

  renderTitle(): JSX.Element {
    return (
      <Styled.Title>
        <Styled.Back onClick={this.handleClose}>
          <font-icon name="arrow_left" color="black" size="20" />
        </Styled.Back>
        {this.name}
      </Styled.Title>
    );
  }

  renderInformation(): JSX.Element {
    return (
      <Styled.Information>
        {this.information.map((item, index) =>
          this.renderInfoItem(item, index),
        )}
      </Styled.Information>
    );
  }

  renderInfoItem(item: App.Any, index: number): JSX.Element {
    return (
      <fragment key={index}>
        {item.value && (
          <Styled.InfoItem>
            {item.icon && <font-icon name={item.icon} size="18" />}
            {item.title && <Styled.InfoTitle>{item.title}</Styled.InfoTitle>}
            <Styled.InfoTitle isBig={item.isBig}>{item.value}</Styled.InfoTitle>
          </Styled.InfoItem>
        )}
      </fragment>
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

  renderContent(): JSX.Element {
    if (this.isLoading) {
      return (
        <Styled.Empty>
          <SpinLoading />
        </Styled.Empty>
      );
    }
    return (
      <perfect-scrollbar>
        <Styled.Header>
          {this.renderTitle()}
          <Styled.RickInformation>
            <RiskCard risks={this.risks} />
            {this.renderInformation()}
          </Styled.RickInformation>
        </Styled.Header>
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
        {!isEmpty(this.sourceData) && (
          <InformationDetail sourceData={this.sourceData} />
        )}
      </perfect-scrollbar>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper isShow={this.isShow}>
        {this.renderContent()}
      </Styled.Wrapper>
    );
  }
}
