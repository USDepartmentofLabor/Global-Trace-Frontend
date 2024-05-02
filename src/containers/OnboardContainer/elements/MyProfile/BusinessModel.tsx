/* eslint-disable max-lines */
import { Vue, Component, Prop } from 'vue-property-decorator';
import { map, includes } from 'lodash';
import moment from 'moment';
import { getUserFacility } from 'utils/user';
import { dateToISOString } from 'utils/date';
import { convertUnixTimestampToDate } from 'utils/helpers';
import { convertEnumToTranslation } from 'utils/translation';
import { getProfileCertificationList } from 'api/onboard';
import { getCommodities } from 'api/user-setting';
import { SpinLoading } from 'components/Loaders';
import DatePicker from 'components/FormUI/DatePicker';
import Dropdown from 'components/FormUI/Dropdown';
import { handleError } from 'components/Toast';
import * as Styled from './styled';

@Component
export default class BusinessModel extends Vue {
  @Prop({ required: true }) readonly userInfo: Auth.User;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop({ default: false }) readonly isMassBalance: boolean;

  private selectedCertification: App.DropdownOption = null;
  private selectedCommodities: App.DropdownOption[] = null;
  private selectedReconciliationDuration: App.DropdownOption = null;
  private certificationOptions: App.DropdownOption[] = [];
  private commoditiesOptions: App.DropdownOption[] = [];
  private isLoading: boolean = false;

  get userFacility(): Auth.Facility {
    return getUserFacility(this.userInfo);
  }

  get formName(): string {
    return this.$formulate.registry.keys().next().value;
  }

  get formData(): Onboard.ProfileRequestParams {
    return this.$formulate.registry.get(this.formName).proxy;
  }

  get certification(): string {
    return this.formData.certification;
  }

  set certification(value: string) {
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      certification: value,
    });
  }

  get goods(): string[] {
    return this.formData.goods;
  }

  set goods(value: string[]) {
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      goods: value,
    });
  }

  get reconciliationStartAt(): Date {
    const { reconciliationStartAt } = this.formData;
    return reconciliationStartAt
      ? moment(reconciliationStartAt).toDate()
      : null;
  }

  set reconciliationStartAt(value: Date) {
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      reconciliationStartAt: dateToISOString(value),
    });
  }

  get reconciliationDuration(): string {
    return this.formData.reconciliationDuration;
  }

  set reconciliationDuration(value: string) {
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      reconciliationDuration: value,
    });
  }

  get reconciliationDurationOptions(): App.DropdownOption[] {
    const options: App.DropdownOption[] = [];
    for (let i = 1; i <= 12; i++) {
      const name =
        i > 1 ? `${i} ${this.$t('months')}` : `${i} ${this.$t('month')}`;
      options.push({
        id: `${i} Month`,
        name,
      });
    }
    return options;
  }

  created(): void {
    this.fetchData();
    this.initReconciliationStartAt();
    this.initReconciliationDuration();
  }

  fetchData(): void {
    this.isLoading = true;
    Promise.all([this.getCertificationList(), this.getCommodities()]);
    this.isLoading = false;
  }

  initReconciliationStartAt(): void {
    const { reconciliationStartAt } = this.userFacility;
    if (reconciliationStartAt) {
      this.reconciliationStartAt = convertUnixTimestampToDate(
        reconciliationStartAt,
      );
    }
  }

  initReconciliationDuration(): void {
    const reconciliationDurationDefault =
      this.reconciliationDurationOptions.find(
        ({ id }) => id === this.userFacility.reconciliationDuration,
      );
    if (reconciliationDurationDefault) {
      this.onChangeReconciliationDuration(reconciliationDurationDefault);
    }
  }

  initCertification(): void {
    const userCertification = this.certificationOptions.find(
      ({ id }) => id === this.userFacility.certification,
    );
    this.onChangeCertification(userCertification);
  }

  initCommodities(): void {
    const userCommodities = this.commoditiesOptions.filter(({ id }) =>
      includes(this.userFacility.goods, id),
    );
    this.onChangeCommodities(userCommodities);
  }

  async getCertificationList(): Promise<void> {
    try {
      const response = await getProfileCertificationList();
      this.certificationOptions = response.map(({ id, name }) => ({
        id: name,
        name: this.$t(convertEnumToTranslation(id as string)),
      }));
      this.initCertification();
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  async getCommodities(): Promise<void> {
    try {
      const response = await getCommodities();
      this.commoditiesOptions = response.map((commodity) => ({
        id: commodity,
        name: commodity,
      }));
      this.initCommodities();
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  onChangeCertification(option: App.DropdownOption): void {
    this.selectedCertification = option;
    this.certification = option ? (option.id as string) : null;
  }

  onChangeCommodities(option: App.DropdownOption[]): void {
    this.selectedCommodities = option;
    this.goods = option ? map(option, 'id' as string) : null;
  }

  onChangeReconciliationDuration(option: App.DropdownOption): void {
    this.selectedReconciliationDuration = option;
    this.reconciliationDuration = option ? (option.id as string) : null;
  }

  disabledReconciliationDate(date: Date): boolean {
    const validDate = moment().toDate();
    return date > validDate;
  }

  changeReconciliationDate(reconciliationStartAt: string): void {
    this.reconciliationStartAt = moment(reconciliationStartAt).toDate();
  }

  renderCertification(): JSX.Element {
    return (
      <Styled.Column>
        <Dropdown
          title={this.$t('certification')}
          height="48px"
          variant="material"
          options={this.certificationOptions}
          width="100%"
          trackBy="id"
          value={this.selectedCertification}
          changeOptionValue={this.onChangeCertification}
          placeholder={this.$t('certification')}
          disabled={this.disabled}
          overflow
        />
      </Styled.Column>
    );
  }

  renderGoods(): JSX.Element {
    return (
      <Styled.Column>
        <Dropdown
          title={this.$t('goods')}
          height="48px"
          variant="material"
          options={this.commoditiesOptions}
          width="100%"
          trackBy="id"
          isMultiple
          value={this.selectedCommodities}
          changeOptionValue={this.onChangeCommodities}
          placeholder={this.$t('select_goods')}
          disabled={this.disabled}
          overflow
          limit={1}
          taggable
        />
      </Styled.Column>
    );
  }

  renderReconciliationStartAt(): JSX.Element {
    return (
      <DatePicker
        label={this.$t('reconciliation_window_start_date')}
        height="48px"
        variant="material"
        placeholder={this.$t('reconciliation_window_start_date')}
        value={this.reconciliationStartAt}
        disabledDate={this.disabledReconciliationDate}
        selectDate={this.changeReconciliationDate}
        disabled={this.disabled}
        appendToBody={false}
      />
    );
  }

  renderReconciliationDuration(): JSX.Element {
    return (
      <Dropdown
        title={this.$t('reconciliation_window_duration')}
        height="48px"
        variant="material"
        options={this.reconciliationDurationOptions}
        width="100%"
        value={this.selectedReconciliationDuration}
        changeOptionValue={this.onChangeReconciliationDuration}
        placeholder={this.$t('reconciliation_window_duration')}
        allowEmpty={false}
        overflow
      />
    );
  }

  renderReconciliation(): JSX.Element {
    return (
      <Styled.Group>
        <Styled.SubTitle>{this.$t('mass_balance')}</Styled.SubTitle>
        <Styled.BusinessInformation>
          {this.renderReconciliationStartAt()}
          {this.renderReconciliationDuration()}
        </Styled.BusinessInformation>
      </Styled.Group>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.BusinessCircleWrapper>
        <Styled.BusinessCircleContent>
          <Styled.BusinessGroup>
            {this.renderCertification()}
            {this.renderGoods()}
          </Styled.BusinessGroup>
          {this.isMassBalance && this.renderReconciliation()}
        </Styled.BusinessCircleContent>
        {this.isLoading && <SpinLoading isInline={false} />}
      </Styled.BusinessCircleWrapper>
    );
  }
}
