/* eslint-disable max-lines */
import { Vue, Component } from 'vue-property-decorator';
import { get } from 'lodash';
import auth from 'store/modules/auth';
import { SortType, SupplierViewModeEnum } from 'enums/app';
import brandSupplierModule from 'store/modules/brand-supplier';
import { downloadTemplateUrl } from 'utils/download-helper';
import { getSupplyChainTiers } from 'api/supply-chain';
import { getSupplierMapping, importSuppliers } from 'api/brand-supplier';
import { getShortToken } from 'api/auth';
import { SupplierStatusEnum } from 'enums/user';
import { handleError } from 'components/Toast';
import DataEmpty from 'components/DataEmpty';
import Button from 'components/FormUI/Button';
import SupplierDetail from 'components/SupplierDetail';
import SupplierMap from 'components/SupplierMap/SupplierMap';
import { SpinLoading } from 'components/Loaders';
import ImportValidation from 'components/ImportFile/ImportValidation';
import ImportFile from 'components/ImportFile';
import ActionsBar from './elements/ActionsBar';
import TableView from './elements/TableView';
import * as Styled from './styled';

const BrandSupplierModal = () => import('modals/BrandSupplierModal');

@Component
export default class BrandSuppliersContainer extends Vue {
  private viewMode: string = SupplierViewModeEnum.CATEGORY;
  private isDownloading: boolean = false;
  private isLoading: boolean = false;
  private currentSupplierId: string = null;
  private initialized: boolean = false;
  private hasData: boolean = true;
  private sortInfo: App.SortInfo = {
    sort: SortType.DESC,
    sortKey: 'createdAt',
  };
  private pagination: App.Pagination = {
    total: 0,
    lastPage: 1,
    perPage: 10,
    currentPage: 1,
  };
  private allSupplierGroups: Array<BrandSupplier.SupplierMapGroup[]> = [];
  private tiers: SupplyChain.SupplyChainTier[] = [];

  get hasUploadedFile(): boolean {
    return get(brandSupplierModule.uploadedFile, 'fileObject', false);
  }

  created(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.isLoading = true;
    Promise.all([
      this.getSupplyChainTiers(),
      this.getSupplierList(),
      this.getSupplierMapping(),
    ]);
    this.isLoading = false;
  }

  initSupplier(
    suppliers: BrandSupplier.SupplierItem[],
  ): BrandSupplier.SupplierItem[] {
    return suppliers.map((supplier) => {
      supplier.supplierId = supplier.id;
      supplier.status = SupplierStatusEnum.READY;
      return supplier;
    });
  }

  getSupplierList(): void {
    this.isLoading = true;
    const params = {
      page: this.pagination.currentPage,
      perPage: this.pagination.perPage,
      sortFields: `${this.sortInfo.sortKey}:${this.sortInfo.sort}`,
    };
    brandSupplierModule.getSupplierList({
      params,
      callback: {
        onSuccess: () => {
          this.pagination = {
            total: brandSupplierModule.total,
            lastPage: brandSupplierModule.lastPage,
            currentPage: brandSupplierModule.currentPage,
            perPage: brandSupplierModule.perPage,
          };
          this.hasData = brandSupplierModule.items.length > 0;
        },
        onFailure: (error: App.ResponseError) => {
          handleError(error);
        },
        onFinish: () => {
          this.isLoading = false;
        },
      },
    });
  }

  async getSupplyChainTiers(): Promise<void> {
    try {
      this.tiers = await getSupplyChainTiers({ doesAddBrand: false });
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  reloadSupplierList(): void {
    this.sortInfo = {
      sort: SortType.DESC,
      sortKey: 'createdAt',
    };
    this.pagination.currentPage = 1;
    this.getSupplierList();
  }

  sortColumn(key: string, type: string): void {
    this.sortInfo = {
      sort: type,
      sortKey: key,
    };
    this.getSupplierList();
  }

  onPageChange(page: number): void {
    this.pagination.currentPage = page;
    this.getSupplierList();
  }

  async getSupplierMapping(): Promise<void> {
    try {
      this.isLoading = true;
      this.allSupplierGroups = await getSupplierMapping();
      this.initialized = true;
      this.hasData = this.allSupplierGroups.length > 0;
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  onChangeViewMode(mode: string): void {
    this.viewMode = mode;
    this.initData();
  }

  importSupplierSuccess(): void {
    this.initData();
  }

  async onValidateSupplier(file: App.SelectedFile): Promise<void> {
    await brandSupplierModule.uploadFileSuppliers({
      data: { file },
      callback: {
        onFailure: (error: App.ResponseError) => {
          handleError(error);
        },
      },
    });
  }

  onResetUpload(): void {
    brandSupplierModule.resetFileSuppliers();
  }

  async onImportSuppliers(): Promise<void> {
    try {
      this.isLoading = true;
      const fileId = get(brandSupplierModule.uploadedResponse, 'fileId', '');
      await importSuppliers(fileId);
      this.$toast.success(this.$t('brandSupplierPage.added_success'));
      this.onResetUpload();
      this.importSupplierSuccess();
      this.initData();
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  async onDownloadTemplate(): Promise<void> {
    try {
      this.isDownloading = true;
      const response = await getShortToken();
      const downloadUrl = downloadTemplateUrl(response.shortToken);
      window.open(downloadUrl, '_blank');
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isDownloading = false;
    }
  }

  initData(): void {
    if (this.viewMode == SupplierViewModeEnum.CATEGORY) {
      this.getSupplierMapping();
    } else {
      this.reloadSupplierList();
    }
  }

  onAddSupplier(): void {
    this.$modal.show(
      BrandSupplierModal,
      {
        onSuccess: this.initData,
      },
      {
        width: '598px',
        height: 'auto',
        classes: 'overflow-visible',
        clickToClose: false,
        adaptive: true,
      },
    );
  }

  openEditSupplierModal(supplier: BrandSupplier.SupplierItem): void {
    this.$modal.show(
      BrandSupplierModal,
      {
        onSuccess: this.getSupplierMapping,
        supplier,
      },
      {
        width: '598px',
        height: 'auto',
        classes: 'overflow-visible',
        clickToClose: false,
        adaptive: true,
      },
    );
  }

  openDetailModal(id: string): void {
    if (auth.hasViewSupplierDetail && id) {
      this.currentSupplierId = id;
    }
  }

  setCurrentSupplierId(value: string = null): void {
    this.currentSupplierId = value;
  }

  renderExcelFormat(): JSX.Element {
    return (
      <Styled.ExcelFormat>
        {this.$t('supplier_excel_format')}
      </Styled.ExcelFormat>
    );
  }

  renderDownloadTemplate(): JSX.Element {
    return (
      <Styled.DownloadTemplate>
        <Styled.Download onClick={() => this.onDownloadTemplate()}>
          {this.$t('download_template')}
        </Styled.Download>
      </Styled.DownloadTemplate>
    );
  }

  renderEmpty(): JSX.Element {
    return (
      <Styled.Empty>
        {!auth.hasManagePartnerMenu && (
          <fragment>
            <Styled.EmptyImage />
            <Styled.EmptyText>
              {this.$t('there_is_no_items_to_show_in_this_view')}
            </Styled.EmptyText>
          </fragment>
        )}
        {!this.hasUploadedFile && auth.hasManagePartnerMenu && (
          <DataEmpty title={this.$t('there_are_no_supplier')}>
            <Styled.Content>
              <Styled.AddNew>
                <Button
                  label={this.$t('add_new_supplier')}
                  width="100%"
                  click={this.onAddSupplier}
                />
              </Styled.AddNew>
              <ImportFile validateFile={this.onValidateSupplier}>
                <Button label={this.$t('import_new_suppliers')} width="245px" />
              </ImportFile>
              {this.renderExcelFormat()}
              {this.renderDownloadTemplate()}
            </Styled.Content>
          </DataEmpty>
        )}
      </Styled.Empty>
    );
  }

  renderContent(): JSX.Element {
    if (!this.initialized) {
      return <SpinLoading isInline={false} />;
    } else if (!this.hasData) {
      return this.renderEmpty();
    }
    return (
      <Styled.Container>
        <ActionsBar
          isDownloading={this.isDownloading}
          viewMode={this.viewMode}
          changeViewMode={this.onChangeViewMode}
          addSupplier={this.onAddSupplier}
          downloadTemplate={this.onDownloadTemplate}
          validateFile={this.onValidateSupplier}
        />
        {this.viewMode == SupplierViewModeEnum.CATEGORY && (
          <fragment>
            {this.isLoading && <SpinLoading isInline={false} />}
            {!this.isLoading && (
              <SupplierMap
                data={this.allSupplierGroups}
                tiers={this.tiers}
                editSupplier={this.openEditSupplierModal}
                clickSupplier={({ id }: { id: string }) => {
                  this.openDetailModal(id);
                }}
              />
            )}
          </fragment>
        )}
        {this.viewMode == SupplierViewModeEnum.LIST && (
          <TableView
            suppliers={brandSupplierModule.items}
            pagination={this.pagination}
            isLoading={this.isLoading}
            pageChange={this.onPageChange}
            sortColumn={this.sortColumn}
            editSuccess={this.getSupplierList}
            deleteSuccess={this.reloadSupplierList}
            changeCurrentSupplierId={this.setCurrentSupplierId}
          />
        )}
      </Styled.Container>
    );
  }

  render(): JSX.Element {
    return (
      <dashboard-layout>
        <Styled.Wrapper>
          {this.hasUploadedFile && (
            <ImportValidation
              response={brandSupplierModule.uploadedResponse}
              fileName={brandSupplierModule.uploadedFile.name}
              validateFile={this.onValidateSupplier}
              uploadFile={this.onImportSuppliers}
              resetUpload={this.onResetUpload}
              isLoading={this.isLoading}
              variant="circle"
            />
          )}
          {!this.hasUploadedFile && this.renderContent()}
        </Styled.Wrapper>
        {this.currentSupplierId && (
          <SupplierDetail
            supplierId={this.currentSupplierId}
            close={() => {
              this.setCurrentSupplierId();
            }}
          />
        )}
      </dashboard-layout>
    );
  }
}
