import { Vue, Component, Prop } from 'vue-property-decorator';
import moment from 'moment';
import requestModule from 'store/modules/request';
import { createRiskScanReport } from 'api/grievance-report';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import IndicatorManagement from 'components/IndicatorManagement/IndicatorManagement';
import { getBusinessLocation, getUploadFileParams } from 'utils/helpers';
import Form from './elements/Form';
import * as Styled from './styled';

@Component
export default class CommunityRiskScanModal extends Vue {
  @Prop({
    default: () => {
      //
    },
  })
  onSuccess: (respond: GrievanceReport.Response) => void;

  private isSubmitting: boolean = false;
  private isLoading: boolean = false;
  private isAddingLaborRisk: boolean = false;
  private formName: string = 'communityRiskScan';
  private formInput: GrievanceReport.CommunityRiskScanParams = {
    facilityId: '',
    location: '',
    message: '',
    priority: null,
    recordedAt: null,
    uploadFiles: null,
    laborRisks: [],
  };
  private laborRisks: GrievanceReport.LaborRiskParams[] = [];

  get modalTitle(): string {
    return this.isAddingLaborRisk
      ? this.$t('indicators')
      : this.$t('create_incident_report');
  }

  created(): void {
    this.isLoading = true;
    Promise.all([this.getIndicators()]);
    this.isLoading = false;
  }

  getIndicators(): Promise<void> {
    return new Promise((resolve) => {
      if (requestModule.indicators.length === 0) {
        requestModule.getIndicators({
          callback: {
            onFailure: (error: App.ResponseError) => {
              handleError(error);
            },
            onFinish: () => {
              resolve();
            },
          },
        });
      }
    });
  }

  async getPayload(): Promise<GrievanceReport.CommunityRiskScanParams> {
    return {
      ...this.formInput,
      priority: parseInt(this.formInput.priority),
      recordedAt: moment(this.formInput.recordedAt).unix(),
      uploadFiles: await getUploadFileParams(
        this.formInput.uploadFiles as File[],
      ),
    };
  }

  async createResponses(): Promise<void> {
    this.isSubmitting = true;
    try {
      const payload = await this.getPayload();
      await createRiskScanReport(payload);
      this.$toast.success(this.$t('submitted'));
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

  onChangeFiles(files: File[]): void {
    this.formInput.uploadFiles = files;
  }

  setFacility(facility: GrievanceReport.Facility): void {
    this.formInput.facilityId = facility.id;
    this.formInput.location = getBusinessLocation(facility);
  }

  changeSearch(): void {
    this.$formulate.resetValidation(this.formName);
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

  toggleAddingLaborRisk(): void {
    this.isAddingLaborRisk = !this.isAddingLaborRisk;
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
              selectedFacility={this.formInput.facilityId}
              laborRisks={this.laborRisks}
              hasErrors={hasErrors}
              isSubmitting={this.isSubmitting}
              changeFiles={this.onChangeFiles}
              addIndicator={this.toggleAddingLaborRisk}
              changeSearch={this.changeSearch}
              setFacility={this.setFacility}
              cancel={this.closeModal}
            />
          ),
        }}
      />
    );
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

  render(): JSX.Element {
    return (
      <modal-layout
        title={this.modalTitle}
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
