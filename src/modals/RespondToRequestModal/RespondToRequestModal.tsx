import { Vue, Component, Prop } from 'vue-property-decorator';
import moment from 'moment';
import requestModule from 'store/modules/request';
import { createResponses } from 'api/grievance-report';
import { getUploadFileParams } from 'utils/helpers';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import IndicatorManagement from 'components/IndicatorManagement/IndicatorManagement';
import * as Styled from './styled';
import Form from './elements/Form';

@Component
export default class RespondToRequestModal extends Vue {
  @Prop({ default: true }) readonly showAuditReportNumber: string;
  @Prop({ required: true }) readonly uploadLabel: string;
  @Prop({ required: true }) readonly id: string;
  @Prop({
    default: () => {
      //
    },
  })
  onSuccess: (respond: GrievanceReport.Response) => void;

  private isSubmitting: boolean = false;
  private isLoading: boolean = false;
  private formName: string = 'respondToRequest';
  private formInput: GrievanceReport.ResponseRequestParams = {
    indicator: '',
    message: '',
    auditReportNumber: '',
    recordedAt: null,
    uploadImages: null,
    priority: null,
    laborRisks: [],
  };
  private isAddingLaborRisk: boolean = false;
  private laborRisks: GrievanceReport.LaborRiskParams[] = [];

  created(): void {
    this.getIndicators();
  }

  getIndicators() {
    this.isLoading = true;
    requestModule.getIndicators({
      callback: {
        onFailure: (error: App.ResponseError) => {
          handleError(error);
        },
        onFinish: () => {
          this.isLoading = false;
        },
      },
    });
  }

  onSubmit(): void {
    this.createResponses();
  }

  async getPayload(): Promise<GrievanceReport.ResponseRequestParams> {
    return {
      ...this.formInput,
      priority: parseInt(this.formInput.priority),
      recordedAt: moment(this.formInput.recordedAt).unix(),
      auditReportNumber: this.showAuditReportNumber
        ? this.formInput.auditReportNumber
        : undefined,
      uploadImages: await getUploadFileParams(
        this.formInput.uploadImages as File[],
      ),
    };
  }

  async createResponses(): Promise<void> {
    this.isSubmitting = true;
    try {
      const payload = await this.getPayload();
      const respond = await createResponses(this.id, payload);
      this.$toast.success(this.$t('response_submitted'));
      this.onSuccess({ ...respond, ...{ laborRisks: payload.laborRisks } });
      this.closeModal();
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isSubmitting = false;
    }
  }

  closeModal(): void {
    if (this.isAddingLaborRisk) {
      this.toggleAddingLaborRisk();
    } else {
      this.$emit('close');
    }
  }

  toggleAddingLaborRisk(): void {
    this.isAddingLaborRisk = !this.isAddingLaborRisk;
  }

  onChangeFiles(files: File[]): void {
    this.formInput.uploadImages = files;
  }

  onChangeLaborRisks(data: GrievanceReport.LaborRiskParams[]): void {
    this.formInput.laborRisks = data.map(
      ({ indicator, subIndicator, severity }) => ({
        indicatorId: indicator.id as string,
        subIndicatorId: subIndicator.id as string,
        severity: parseInt(severity.value),
      }),
    );
    this.laborRisks = data;
    this.toggleAddingLaborRisk();
  }

  renderIndicators(): JSX.Element {
    return (
      <IndicatorManagement
        data={this.laborRisks}
        back={this.toggleAddingLaborRisk}
        change={this.onChangeLaborRisks}
      />
    );
  }

  renderForm(): JSX.Element {
    return (
      <formulate-form
        name={this.formName}
        v-model={this.formInput}
        vOn:submit={this.createResponses}
        scopedSlots={{
          default: ({ hasErrors }: { hasErrors: boolean }) => (
            <Form
              showAuditReportNumber={this.showAuditReportNumber}
              laborRisks={this.laborRisks}
              hasErrors={hasErrors}
              isSubmitting={this.isSubmitting}
              changeFiles={this.onChangeFiles}
              addIndicator={this.toggleAddingLaborRisk}
              cancel={this.closeModal}
            />
          ),
        }}
      />
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout
        title={this.$t('respond_to_incident')}
        closeModal={this.closeModal}
        showBack={this.isAddingLaborRisk}
        back={this.toggleAddingLaborRisk}
      >
        <Styled.Wrapper>
          {this.isLoading && <SpinLoading isInline={false} />}
          <keep-alive>
            {this.isAddingLaborRisk
              ? this.renderIndicators()
              : this.renderForm()}
          </keep-alive>
        </Styled.Wrapper>
      </modal-layout>
    );
  }
}
