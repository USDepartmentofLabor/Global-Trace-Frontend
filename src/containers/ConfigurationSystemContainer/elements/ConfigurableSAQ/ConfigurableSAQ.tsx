/* eslint-disable max-lines-per-function, max-lines */
import { Vue, Component, Prop } from 'vue-property-decorator';
import { debounce, isEmpty } from 'lodash';
import { SpinLoading } from 'components/Loaders';
import Input from 'components/FormUI/Input';
import Button from 'components/FormUI/Button';
import DataTable from 'components/DataTable/DataTable';
import saqModule from 'store/modules/saq';
import { SortType } from 'enums/app';
import { SettingTabEnum } from 'enums/setting';
import { handleError } from 'components/Toast';
import { StatusSAQ } from 'enums/saq';
import * as Styled from './styled';

const AttachmentModal = () => import('modals/AttachmentModal');
const UploadSAQTranslationModal = () =>
  import('modals/UploadSAQTranslationModal');

@Component
export default class ConfigurableSAQ extends Vue {
  @Prop({
    default: () => {
      //
    },
  })
  ready: (name: SettingTabEnum) => void;

  private isLoading = false;
  private isGetting: boolean = false;
  private search: string = '';
  private sortInfo: App.SortInfo = {
    sort: SortType.DESC,
    sortKey: 'createdAt',
  };
  private requestParams: App.RequestParams = null;
  private abortController: AbortController = null;

  get columns(): App.DataTableColumn[] {
    return [
      {
        label: this.$t('role'),
        field: 'name',
        sortable: true,
        sortKey: 'name',
        width: '35%',
      },
      {
        label: this.$t('status'),
        field: 'status',
        sortable: false,
        sortKey: 'status',
      },
      {
        label: this.$t('saq'),
        field: 'file',
        sortable: false,
      },
      {
        label: this.$t('saq_translation'),
        field: 'translation',
        sortable: false,
      },
    ];
  }

  created() {
    this.initData();
    this.onDebouncedSearch = debounce(this.onDebouncedSearch, 300);
  }

  initData(): void {
    const { sort, sortKey } = this.sortInfo;
    this.requestParams = {
      sortField: sortKey,
      sortDirection: sort,
    };
    this.getConfigurableSAQ(this.requestParams);
  }

  reloadData() {
    const { sort, sortKey } = this.sortInfo;
    this.requestParams = {
      key: this.search,
      sortField: sortKey,
      sortDirection: sort,
    };
    this.getConfigurableSAQ(this.requestParams);
  }

  async getConfigurableSAQ(params: App.RequestParams) {
    this.isGetting = true;
    const requestParams = { ...this.requestParams, ...params };
    saqModule.getConfigurableSAQ({
      params: requestParams,
      callback: {
        onFailure: (error: App.ResponseError) => {
          if (error) {
            handleError(error as App.ResponseError);
          }
        },
        onFinish: () => {
          this.isGetting = false;
          this.isLoading = false;
          const isDone =
            !isEmpty(saqModule.configurableSAQ) &&
            saqModule.configurableSAQ.every(({ fileSaq }) => !isEmpty(fileSaq));
          if (isDone) {
            this.ready(SettingTabEnum.CONFIGURABLE_SAQ);
          }
        },
      },
    });
  }

  onDebouncedSearch(params: App.RequestParams): void {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.getConfigurableSAQ(params);
  }

  handleInputSearch(value: string): void {
    this.search = value;
    this.requestParams.key = value;
    this.onDebouncedSearch(this.requestParams);
  }

  sortColumn(key: string, type: string): void {
    this.sortInfo = {
      sort: type,
      sortKey: key,
    };
    this.requestParams = {
      ...this.requestParams,
      sortField: key,
      sortDirection: type,
    };
    this.getConfigurableSAQ(this.requestParams);
  }

  pageOnChange(page: number): void {
    this.requestParams.page = page;
    this.getConfigurableSAQ(this.requestParams);
  }

  openAttachmentModal(
    roleName: string,
    roleId: string,
    hasFacilityGroupTemplate: boolean,
  ): void {
    this.$modal.show(
      AttachmentModal,
      {
        roleName,
        roleId,
        hasFacilityGroupTemplate,
        onSuccess: this.initData,
      },
      {
        name: 'AttachmentModal',
        classes: 'fromRight',
        styles: 'border-radius: 0;',
        width: 600,
        height: '100%',
        shiftX: 1,
        clickToClose: false,
      },
    );
  }

  openTransitionModal(roleName: string, roleId: string): void {
    this.$modal.show(
      UploadSAQTranslationModal,
      {
        roleName,
        roleId,
        onSuccess: this.initData,
      },
      {
        name: 'UploadSAQTranslateModal',
        classes: 'fromRight',
        styles: 'border-radius: 0;',
        width: 600,
        height: '100%',
        shiftX: 1,
        clickToClose: false,
      },
    );
  }

  renderRowItem(item: SAQ.ConfigurableSAQ): JSX.Element {
    const { id, name, status, hasFacilityGroupTemplate } = item;
    return (
      <Styled.Tr>
        <Styled.Td>{name}</Styled.Td>
        <Styled.Td>
          <Styled.RowStatus>
            <Styled.Status>
              {status.saqStatus === StatusSAQ.UPLOADED && (
                <font-icon name="check" color="highland" size="16" />
              )}
              {status.saqStatus === StatusSAQ.WAITING && (
                <font-icon name="remove" color="ghost" size="16" />
              )}
              {this.$t('saq')}
            </Styled.Status>
            <Styled.Status>
              {status.saqTranslationStatus === StatusSAQ.UPLOADED && (
                <font-icon name="check" color="highland" size="16" />
              )}
              {status.saqTranslationStatus === StatusSAQ.WAITING && (
                <font-icon name="remove" color="ghost" size="16" />
              )}
              {this.$t('saq_translation')}
            </Styled.Status>
          </Styled.RowStatus>
        </Styled.Td>
        <Styled.Td>
          <Styled.RowActions>
            <Button
              label={this.$t('manage_attachments')}
              icon="attach_file"
              variant="transparentSecondary"
              size="small"
              iconSize="20"
              click={() =>
                this.openAttachmentModal(name, id, hasFacilityGroupTemplate)
              }
            />
          </Styled.RowActions>
        </Styled.Td>
        <Styled.Td>
          <Styled.RowActions>
            <Button
              label={this.$t('upload_saq_translation')}
              icon="export"
              variant="transparentSecondary"
              size="small"
              iconSize="20"
              disabled={status.saqStatus === StatusSAQ.WAITING}
              click={() => this.openTransitionModal(name, id)}
            />
          </Styled.RowActions>
        </Styled.Td>
      </Styled.Tr>
    );
  }

  renderTableHeader(): JSX.Element {
    return (
      <Styled.TableHeader>
        <Input
          height="40px"
          name="search"
          size="large"
          value={this.search}
          placeholder={this.$t('search_for_role')}
          changeValue={(value: string) => {
            this.handleInputSearch(value);
          }}
          prefixIcon="search"
        />
      </Styled.TableHeader>
    );
  }

  renderTable(): JSX.Element {
    return (
      <DataTable
        numberRowLoading={10}
        isLoading={this.isGetting}
        columns={this.columns}
        data={saqModule.configurableSAQ}
        hasPagination={false}
        sortColumn={this.sortColumn}
        pageOnChange={this.pageOnChange}
        scopedSlots={{
          tableRow: ({ item }: { item: SAQ.ConfigurableSAQ }) =>
            this.renderRowItem(item),
        }}
      />
    );
  }

  renderContent(): JSX.Element {
    if (this.isLoading) {
      return <SpinLoading />;
    }
    return (
      <Styled.Container>
        {this.renderTableHeader()}
        {this.renderTable()}
      </Styled.Container>
    );
  }

  render(): JSX.Element {
    return <Styled.Wrapper>{this.renderContent()}</Styled.Wrapper>;
  }
}
