import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { get } from 'lodash';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import {
  getRiskAssessment,
  getRiskAssessmentProperties,
  getRiskAssessmentReportRoles,
  updateRiskAssessment,
} from 'api/risk-assessment';
import { MethodologyEnum } from 'enums/risk-assessment';
import { SettingTabEnum } from 'enums/setting';
import * as Styled from './styled';
import Information from './elements/Information';
import Methodology from './elements/Methodology';

@Component
export default class RiskAssessment extends Vue {
  @Prop({
    default: () => {
      //
    },
  })
  finish: (tabName: SettingTabEnum) => void;

  private isLoading = true;
  private isSubmitting = false;
  private properties: RiskAssessmentManagement.RiskAssessmentProperties = null;
  private reportRoles: RoleAndPermission.Role[] = null;
  private formInput: RiskAssessmentManagement.RiskAssessmentParams = {
    methodology: null,
    geographyWeight: null,
    listOfGoodsWeight: null,
    saqsWeight: null,
    dnaWeight: null,
    hotlineWeight: null,
    roleWeights: [],
  };
  private showMethodology = true;
  public messageErrors: App.MessageError = null;

  get enableInformation(): boolean {
    return this.formInput.methodology === MethodologyEnum.WEIGHTED_AVERAGE;
  }

  @Watch('$route.query', { immediate: true, deep: true })
  onChangeQuery() {
    const tabName = get(this.$route.query, 'tabName');
    if (tabName == SettingTabEnum.RISK_ASSESSMENT) {
      this.showMethodology = true;
      this.initData();
    }
  }

  created() {
    this.initData();
  }

  async initData(): Promise<void> {
    this.isLoading = true;
    await Promise.all([
      this.getRiskAssessmentProperties(),
      this.getRiskAssessmentReportRoles(),
      this.getBusinessDetail(),
    ]);
    this.isLoading = false;
  }

  async getRiskAssessmentProperties(): Promise<void> {
    try {
      this.properties = await getRiskAssessmentProperties();
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  async getRiskAssessmentReportRoles(): Promise<void> {
    try {
      this.reportRoles = await getRiskAssessmentReportRoles();
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  async getBusinessDetail(): Promise<void> {
    try {
      const data = await getRiskAssessment();
      this.formInput = {
        ...this.formInput,
        ...data,
      };
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  getParams(
    params: RiskAssessmentManagement.RiskAssessmentParams,
  ): RiskAssessmentManagement.RiskAssessmentParams {
    const { methodology } = params;
    return {
      methodology,
      ...this.getInformationParams(params),
    };
  }

  getInformationValue(value: number): number | null {
    return this.enableInformation ? parseInt(value.toString(), 10) : null;
  }

  getRoleWeightValue(
    weights: RiskAssessmentManagement.RoleWeight[],
  ): RiskAssessmentManagement.RoleWeight[] {
    weights = weights.filter(({ roleId }) =>
      Boolean(this.reportRoles.find(({ id }) => roleId === id)),
    );
    return weights.map((value) => {
      value.weight = this.getInformationValue(value.weight);
      return value;
    });
  }

  getInformationParams(
    params: RiskAssessmentManagement.RiskAssessmentParams,
  ): RiskAssessmentManagement.RiskAssessmentParams {
    const {
      geographyWeight,
      listOfGoodsWeight,
      saqsWeight,
      dnaWeight,
      hotlineWeight,
      roleWeights,
    } = params;
    return {
      geographyWeight: this.getInformationValue(geographyWeight),
      listOfGoodsWeight: this.getInformationValue(listOfGoodsWeight),
      saqsWeight: this.getInformationValue(saqsWeight),
      dnaWeight: this.getInformationValue(dnaWeight),
      hotlineWeight: this.getInformationValue(hotlineWeight),
      roleWeights: this.getRoleWeightValue(roleWeights),
    };
  }

  async onSubmit(
    params: RiskAssessmentManagement.RiskAssessmentParams = null,
  ): Promise<void> {
    try {
      this.isSubmitting = true;
      await updateRiskAssessment(
        this.getParams({
          ...this.formInput,
          ...params,
        }),
      );
      this.finish(SettingTabEnum.RISK_ASSESSMENT);
    } catch (error) {
      handleError(error as App.ResponseError);
      this.messageErrors = get(error, 'errors');
    } finally {
      this.isSubmitting = false;
    }
  }

  methodologySuccess(value: string): void {
    this.formInput.methodology = value;
    if (this.enableInformation) {
      this.showMethodology = false;
    } else {
      this.formInput.roleWeights = [];
      this.onSubmit();
    }
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  onBack(): void {
    this.showMethodology = true;
  }

  renderContent(): JSX.Element {
    if (this.showMethodology) {
      return (
        <Methodology
          defaultValue={this.formInput.methodology}
          next={this.methodologySuccess}
        />
      );
    }
    if (this.enableInformation) {
      return (
        <Information
          defaultValue={this.formInput}
          messageErrors={this.messageErrors}
          isSubmitting={this.isSubmitting}
          properties={this.properties}
          reportRoles={this.reportRoles}
          clearMessageErrors={this.onClearMessageErrors}
          back={this.onBack}
          next={this.onSubmit}
        />
      );
    }
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        {this.isLoading && <SpinLoading />}
        {!this.isLoading && this.renderContent()}
      </Styled.Wrapper>
    );
  }
}
