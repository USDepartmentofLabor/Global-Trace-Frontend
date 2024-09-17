import { Vue, Component, Prop } from 'vue-property-decorator';
import { get, head } from 'lodash';
import { getShortToken } from 'api/auth';
import { getFacilityGroup, updateFacilities } from 'api/facility-management';
import { formatDate } from 'utils/date';
import { downloadFromUrl, getBusinessLocation } from 'utils/helpers';
import { downloadFacilityGroupRiskAssessment } from 'utils/download-helper';
import { convertEnumToTranslation } from 'utils/translation';
import facilityManagementModule from 'store/modules/facility-management';
import Input from 'components/FormUI/Input';
import Button from 'components/FormUI/Button';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import ImportFile from 'components/ImportFile';
import InputGroup from 'components/FormUI/InputGroup';
import SupplierDetail from 'components/SupplierDetail';
import * as Styled from './styled';

const ImportRiskAssessmentModal = () =>
  import('modals/ImportRiskAssessmentModal');

@Component
export default class FacilityGroupInformationModal extends Vue {
  @Prop({ required: true }) readonly id: string;

  private facility: Auth.Facility = null;
  private isLoading: boolean = false;
  private currentSupplierId: string = null;

  get facilityId(): string {
    return this.facility.farmId;
  }

  get title(): string {
    return get(this.facility, 'name');
  }

  get fileUpdatedAt(): number {
    return head(get(this.facility, 'farms')).updatedAt;
  }

  created(): void {
    this.getFacility();
  }

  async getFacility(): Promise<void> {
    try {
      this.isLoading = true;
      this.facility = await getFacilityGroup(this.id);
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  closeModal(): void {
    this.$emit('close');
  }

  onValidateFile(file: App.SelectedFile): Promise<void> {
    return new Promise((resolve, reject) => {
      facilityManagementModule.uploadFile({
        params: {
          facilityGroupId: this.id,
          roleId: get(this.$route, 'meta.params.id'),
          isUpdating: true,
        },
        data: { file },
        callback: {
          onSuccess: resolve,
          onFailure: (error: App.ResponseError) => {
            handleError(error);
            reject();
          },
        },
      });
    });
  }

  async onImportFile(): Promise<void> {
    try {
      const fileId = get(
        facilityManagementModule.uploadedResponse,
        'fileId',
        '',
      );
      const params: FacilityManagement.UpdateFacilityRequest = {
        fileId,
        roleId: get(this.$route, 'meta.params.id'),
      };
      await updateFacilities(this.id, params);
      facilityManagementModule.resetFileUpload();
      this.$toast.success(this.$t('successfully_updated_facility_group'));
      this.getFacility();
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  onCloseProcessingModal(): void {
    this.$modal.show(
      ImportRiskAssessmentModal,
      {
        validateFile: this.onValidateFile,
        import: this.onImportFile,
      },
      {
        name: 'ImportRiskAssessmentModal',
        width: '380px',
        height: 'auto',
        clickToClose: false,
        classes: 'modal-center',
      },
    );
  }

  async downloadUploadedFile(): Promise<void> {
    try {
      const response = await getShortToken();
      const downloadUrl = downloadFacilityGroupRiskAssessment(
        response.shortToken,
        get(this.$route, 'meta.params.id'),
        this.id,
      );
      downloadFromUrl(downloadUrl, () => {
        this.$toast.success(this.$t('successfully_downloaded'));
      });
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  setCurrentSupplierId(value: string = null): void {
    this.currentSupplierId = value;
  }

  renderFacility(facility: Auth.Facility): JSX.Element {
    return (
      <fragment>
        <Styled.Field>{this.$t('id')}</Styled.Field>
        <Styled.Value>{facility.farmId}</Styled.Value>
        <Styled.Field>{this.$t('facilityModal.tehsil')}</Styled.Field>
        <Styled.Value>
          {get(facility, 'additionalInformation.tehsil')}
        </Styled.Value>
        <Styled.Field>{this.$t('business_code')}</Styled.Field>
        <Styled.Value>{facility.businessRegisterNumber}</Styled.Value>
        <Styled.Field>{this.$t('facilityModal.certificate')}</Styled.Field>
        <Styled.Value>
          {this.$t(convertEnumToTranslation(get(facility, 'certification')))}
        </Styled.Value>
      </fragment>
    );
  }

  renderFacilityList(): JSX.Element {
    return (
      <Styled.FacilityListContainer>
        <Styled.Label>{this.$t('facilityModal.list')}</Styled.Label>
        <Styled.FacilityList>
          <perfect-scrollbar>
            {this.facility.farms.map((farm) => (
              <Styled.FacilityDetail>
                <Styled.FacilityName>{farm.name}</Styled.FacilityName>
                <Styled.Facility>{this.renderFacility(farm)}</Styled.Facility>
                <Button
                  type="button"
                  icon="note"
                  iconSize="16"
                  size="small"
                  label={this.$t('common.action.view_farm_assessment')}
                  variant="transparentSecondary"
                  underlineLabel
                  click={() => this.setCurrentSupplierId(farm.id)}
                />
              </Styled.FacilityDetail>
            ))}
          </perfect-scrollbar>
        </Styled.FacilityList>
      </Styled.FacilityListContainer>
    );
  }

  renderFacilityInfo(): JSX.Element {
    return (
      <InputGroup column={2}>
        <Input
          height="48px"
          label={this.$t('id')}
          name="facilityId"
          value={this.facilityId}
          readonly
          disabled
        />
        <Input
          height="48px"
          label={this.$t('facilityModal.location_full')}
          name="facilityLocation"
          value={getBusinessLocation(this.facility)}
          readonly
          disabled
        />
      </InputGroup>
    );
  }

  renderActions(): JSX.Element {
    const date = formatDate(this.fileUpdatedAt);
    return (
      <Styled.Actions>
        <Button
          type="button"
          icon="TreeView"
          iconSize="16"
          size="small"
          label={this.$t('common.action.view_farm_group_assessment')}
          variant="transparentSecondary"
          underlineLabel
          click={() => this.setCurrentSupplierId(this.id)}
        />
        <Button
          width="100%"
          type="button"
          icon="download"
          iconSize="16"
          size="small"
          label={this.$t('download_template', {
            date: date,
            interpolation: { escapeValue: false },
          })}
          variant="transparentSecondary"
          underlineLabel
          click={() => this.downloadUploadedFile()}
        />
        <ImportFile
          inputId="uploadRiskAssessment"
          isMultipleSheets
          validateFile={this.onValidateFile}
          validatedFile={this.onCloseProcessingModal}
        >
          <Button
            width="100%"
            type="button"
            icon="export"
            iconSize="16"
            size="small"
            label={this.$t('upload_completed_file')}
            variant="transparentSecondary"
            underlineLabel
          />
        </ImportFile>
      </Styled.Actions>
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout title={this.title} closeModal={this.closeModal}>
        <Styled.Wrapper>
          <Styled.Container>
            {this.isLoading && (
              <Styled.Loading>
                <SpinLoading />
              </Styled.Loading>
            )}
            {!this.isLoading && (
              <perfect-scrollbar>
                <Styled.Content>
                  {this.renderFacilityInfo()}
                  {this.renderFacilityList()}
                  {this.renderActions()}
                </Styled.Content>
              </perfect-scrollbar>
            )}
          </Styled.Container>
        </Styled.Wrapper>
        {this.currentSupplierId && (
          <SupplierDetail
            supplierId={this.currentSupplierId}
            close={() => {
              this.setCurrentSupplierId();
            }}
          />
        )}
      </modal-layout>
    );
  }
}
