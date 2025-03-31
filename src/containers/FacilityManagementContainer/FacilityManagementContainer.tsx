import { Vue, Component, Watch } from 'vue-property-decorator';
import { get } from 'lodash';
import { UPLOAD_EXCEL_FILE } from 'config/constants';
import { handleError } from 'components/Toast';
import Button from 'components/FormUI/Button';
import { SpinLoading } from 'components/Loaders';
import {
  getFacilityList,
  importData,
  validDownloadTemplate,
} from 'api/facility-management';
import { getShortToken } from 'api/auth';
import { downloadFacilityGroupTemplateUrl } from 'utils/download-helper';
import ImportFile from 'components/ImportFile';
import facilityManagementModule from 'store/modules/facility-management';
import TableView from './elements/TableView';
import * as Styled from './styled';

const ImportFacilityModal = () => import('modals/ImportFacilityModal');

@Component
export default class FacilityManagementContainer extends Vue {
  private isLoading: boolean = true;
  private isValidDownloadTemplate: boolean = false;
  private pagination: App.Pagination = {
    total: 1,
    lastPage: 1,
    perPage: 20,
    currentPage: 1,
  };
  private requestParams: FacilityManagement.RequestParams = null;
  private facilityList: Auth.Facility[] = [];

  get id(): string {
    return this.$route.meta.params.id;
  }

  get isEmptyFacilityList(): boolean {
    return !this.isLoading && this.facilityList.length === 0;
  }

  @Watch('$route.name', { immediate: true, deep: true })
  onChangeName() {
    this.initData();
  }

  async initData(): Promise<void> {
    this.isLoading = true;
    await Promise.all([
      this.getFacilityGroupList(),
      this.validDownloadTemplate(),
    ]);
    this.isLoading = false;
  }

  async downloadTemplate(): Promise<void> {
    try {
      const response = await getShortToken();
      const downloadUrl = downloadFacilityGroupTemplateUrl(
        this.id,
        response.shortToken,
      );
      window.open(downloadUrl, '_blank');
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  async validDownloadTemplate(): Promise<void> {
    try {
      const requestParams: FacilityManagement.RequestParams = {
        roleId: this.id,
      };
      await validDownloadTemplate(requestParams);
      this.isValidDownloadTemplate = true;
    } catch (error) {
      handleError(error as App.ResponseError);
      this.isValidDownloadTemplate = false;
    }
  }

  async getFacilityGroupList(): Promise<void> {
    try {
      this.requestParams = {
        roleId: this.id,
        page: this.pagination.currentPage,
        perPage: this.pagination.perPage,
      };
      const response = await getFacilityList(this.requestParams);
      this.facilityList = response.items;
      this.pagination = {
        total: response.total,
        lastPage: response.lastPage,
        currentPage: response.currentPage,
        perPage: response.perPage,
      };
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  async importFacilities(): Promise<void> {
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
      await importData(params);
      facilityManagementModule.resetFileUpload();
      this.$toast.success(this.$t('successfully_processed_facility_group'));
      this.reloadList();
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  onPageChange(page: number): void {
    this.pagination.currentPage = page;
    this.getFacilityGroupList();
  }

  reloadList(): void {
    this.pagination.currentPage = 1;
    this.getFacilityGroupList();
  }

  onValidateFacility(file: App.SelectedFile): Promise<void> {
    return new Promise((resolve, reject) => {
      facilityManagementModule.uploadFile({
        params: { roleId: this.id, isUpdating: false },
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

  onCloseProcessingModal(): void {
    this.$modal.show(
      ImportFacilityModal,
      {
        validateFile: this.onValidateFacility,
        validatedFile: this.onCloseProcessingModal,
        import: this.importFacilities,
      },
      {
        name: 'ImportFacilityModal',
        width: '380px',
        height: 'auto',
        clickToClose: false,
        classes: 'modal-center',
      },
    );
  }

  renderEmpty(): JSX.Element {
    if (this.isLoading) {
      return <SpinLoading />;
    }
    return (
      <Styled.Empty>
        <Styled.EmptyImage />
        <Styled.EmptyText>{this.$t('facility_empty_message')}</Styled.EmptyText>
        <Styled.EmptyAction>
          <Button
            label={this.$t('download_template')}
            icon="download"
            variant="outlinePrimary"
            click={this.downloadTemplate}
            disabled={!this.isValidDownloadTemplate}
          />
          <ImportFile
            accept={UPLOAD_EXCEL_FILE.EXTENSIONS}
            isMultipleSheets
            validateFile={this.onValidateFacility}
            validatedFile={this.onCloseProcessingModal}
          >
            <Button
              label={this.$t('upload_completed_file')}
              icon="export"
              disabled={!this.isValidDownloadTemplate}
            />
          </ImportFile>
        </Styled.EmptyAction>
      </Styled.Empty>
    );
  }

  render(): JSX.Element {
    return (
      <dashboard-layout>
        {!this.isEmptyFacilityList && (
          <Styled.HeaderAction slot="headerAction">
            <Button
              label={this.$t('download_template')}
              icon="download"
              variant="outlinePrimary"
              click={this.downloadTemplate}
              disabled={!this.isValidDownloadTemplate}
            />

            <ImportFile
              accept={UPLOAD_EXCEL_FILE.EXTENSIONS}
              isMultipleSheets
              validateFile={this.onValidateFacility}
              validatedFile={this.onCloseProcessingModal}
            >
              <Button
                label={this.$t('upload_new_file')}
                icon="export"
                disabled={!this.isValidDownloadTemplate}
              />
            </ImportFile>
          </Styled.HeaderAction>
        )}
        <Styled.Wrapper>
          {this.isEmptyFacilityList && this.renderEmpty()}
          {!this.isEmptyFacilityList && (
            <TableView
              facilities={this.facilityList}
              pagination={this.pagination}
              isLoading={this.isLoading}
              pageChange={this.onPageChange}
              deleteSuccess={this.reloadList}
            />
          )}
        </Styled.Wrapper>
      </dashboard-layout>
    );
  }
}
