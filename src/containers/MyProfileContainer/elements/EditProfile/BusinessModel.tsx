import { Vue, Component, Prop } from 'vue-property-decorator';
import moment from 'moment';
import { ChainOfCustodyEnum } from 'enums/role';
import { getUserFacility } from 'utils/user';
import { dateToISOString } from 'utils/date';
import { convertUnixTimestampToDate } from 'utils/helpers';
import { convertEnumToTranslation } from 'utils/translation';
import {
  getProfileCertificationList,
  getChainOfCustodyList,
} from 'api/onboard';
import DatePicker from 'components/FormUI/DatePicker';
import Dropdown from 'components/FormUI/Dropdown';
import { handleError } from 'components/Toast';
import MessageError from 'components/FormUI/MessageError';
import * as Styled from './styled';

@Component
export default class BusinessModel extends Vue {
  @Prop({ required: true }) readonly userInfo: Auth.User;
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop() changeCertification: (value: App.DropdownOption) => void;
  @Prop() changeChainOfCustody: (value: App.DropdownOption) => void;
  @Prop() changeReconciliationDuration: (value: App.DropdownOption) => void;
  @Prop({
    default: () => {
      //
    },
  })
  changeInput: () => void;

  private selectedCertification: App.DropdownOption = null;
  private selectedChainOfCustody: App.DropdownOption = null;
  private selectedReconciliationDuration: App.DropdownOption = null;
  private certificationOptions: App.DropdownOption[] = [];
  private chainOfCustodyOptions: App.DropdownOption[] = [];

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

  get chainOfCustody(): string {
    return this.formData.chainOfCustody;
  }

  set chainOfCustody(value: string) {
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      chainOfCustody: value,
    });
  }

  get isMassBalance(): boolean {
    return (
      this.selectedChainOfCustody &&
      this.selectedChainOfCustody.id === ChainOfCustodyEnum.MASS_BALANCE
    );
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
    Promise.all([this.getCertificationList(), this.getChainOfCustodyList()]);
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

  initChainOfCustody(): void {
    const userChainOfCustody = this.chainOfCustodyOptions.find(
      ({ id }) => id === this.userFacility.chainOfCustody,
    );
    this.onChangeChainOfCustody(userChainOfCustody);
  }

  async getCertificationList(): Promise<void> {
    try {
      const response = await getProfileCertificationList();
      this.certificationOptions = response.map(({ name }) => ({
        id: name,
        name: this.$t(convertEnumToTranslation(name)),
      }));
      this.initCertification();
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  async getChainOfCustodyList(): Promise<void> {
    try {
      const response = await getChainOfCustodyList();
      this.chainOfCustodyOptions = response.map(({ id, name }) => ({
        id: name,
        name: this.$t(convertEnumToTranslation(id as string)),
      }));
      this.initChainOfCustody();
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  onChangeCertification(option: App.DropdownOption): void {
    this.selectedCertification = option;
    this.certification = option ? (option.id as string) : null;
    this.changeCertification(option);
  }

  onChangeReconciliationDuration(option: App.DropdownOption): void {
    this.selectedReconciliationDuration = option;
    this.reconciliationDuration = option ? (option.id as string) : null;
    this.changeReconciliationDuration(option);
  }

  onChangeChainOfCustody(option: App.DropdownOption): void {
    this.selectedChainOfCustody = option;
    this.chainOfCustody = option ? (option.id as string) : null;
    this.changeChainOfCustody(option);
  }

  disabledReconciliationDate(date: Date): boolean {
    const validDate = moment().toDate();
    return date > validDate;
  }

  changeReconciliationDate(reconciliationStartAt: string): void {
    this.reconciliationStartAt = moment(reconciliationStartAt).toDate();
    this.changeInput();
  }

  renderCertification(): JSX.Element {
    return (
      <Styled.Input>
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
      </Styled.Input>
    );
  }

  renderChainOfCustody(): JSX.Element {
    return (
      <Styled.Input>
        <Dropdown
          title={this.$t('onboardPage.chain_of_custody')}
          height="48px"
          variant="material"
          options={this.chainOfCustodyOptions}
          width="100%"
          trackBy="id"
          value={this.selectedChainOfCustody}
          changeOptionValue={this.onChangeChainOfCustody}
          placeholder={this.$t('onboardPage.chain_of_custody')}
          disabled
          allowEmpty={false}
          overflow
        />
      </Styled.Input>
    );
  }

  renderReconciliationStartAt(): JSX.Element {
    return (
      <Styled.DateInput>
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
        {this.messageErrors && (
          <MessageError
            field="reconciliationStartAt"
            messageErrors={this.messageErrors}
          />
        )}
      </Styled.DateInput>
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
      <fragment>
        {this.renderReconciliationStartAt()}
        {this.renderReconciliationDuration()}
      </fragment>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.BusinessModelContent>
        {this.renderCertification()}
        {this.renderChainOfCustody()}
        {this.isMassBalance && this.renderReconciliation()}
      </Styled.BusinessModelContent>
    );
  }
}
