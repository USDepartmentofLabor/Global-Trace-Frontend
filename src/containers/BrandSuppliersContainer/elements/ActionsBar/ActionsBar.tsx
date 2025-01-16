/* eslint-disable max-lines-per-function */
import { Vue, Component, Prop } from 'vue-property-decorator';
import { SupplierViewModeEnum } from 'enums/app';
import auth from 'store/modules/auth';
import Button from 'components/FormUI/Button';
import ImportFile from 'components/ImportFile';
import InformationTooltip from 'components/FormUI/InformationTooltip';
import * as Styled from './styled';

@Component
export default class ActionsBar extends Vue {
  @Prop({ default: SupplierViewModeEnum.LIST }) readonly viewMode: string;
  @Prop({ default: false }) readonly isDownloading: boolean;
  @Prop({ required: true }) changeViewMode: (mode: string) => void;
  @Prop({ required: true }) addSupplier: () => void;
  @Prop({ required: true }) downloadTemplate: () => void;
  @Prop({ required: true }) validateFile: () => Promise<void>;

  renderLeftContent(): JSX.Element {
    return (
      <Styled.WrapperLeft>
        <Styled.Title>{this.$t('supplier_mapping')}</Styled.Title>

        <InformationTooltip
          placement="bottom-start"
          tooltipContent={this.$t('supplier_mapping_help')}
        >
          <font-icon
            name="circle_warning2"
            size="20px"
            color="manatee"
            slot="content"
          />
        </InformationTooltip>
      </Styled.WrapperLeft>
    );
  }

  renderRightContent(): JSX.Element {
    return (
      <Styled.WrapperRight>
        <Styled.ViewMode
          isActive={this.viewMode == SupplierViewModeEnum.LIST}
          onClick={() => this.changeViewMode(SupplierViewModeEnum.LIST)}
        >
          <font-icon
            name="menu_list"
            size="16"
            color={
              this.viewMode == SupplierViewModeEnum.LIST
                ? 'highland'
                : 'manatee'
            }
          />
        </Styled.ViewMode>
        <Styled.ViewMode
          isActive={this.viewMode == SupplierViewModeEnum.CATEGORY}
          onClick={() => this.changeViewMode(SupplierViewModeEnum.CATEGORY)}
        >
          <font-icon
            name="category"
            size="16"
            color={
              this.viewMode == SupplierViewModeEnum.CATEGORY
                ? 'highland'
                : 'manatee'
            }
          />
        </Styled.ViewMode>
        {auth.hasManagePartnerMenu && (
          <Styled.Actions>
            <Button
              label={this.$t('add_new_supplier')}
              icon="plus"
              click={this.addSupplier}
            />
            <ImportFile validateFile={this.validateFile}>
              <Button icon="export" label={this.$t('import_new_suppliers')} />
            </ImportFile>
            <Button
              label={this.$t('download_template')}
              icon="download"
              isLoading={this.isDownloading}
              disabled={this.isDownloading}
              click={this.downloadTemplate}
            />
          </Styled.Actions>
        )}
      </Styled.WrapperRight>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Container>
        {this.renderLeftContent()}
        {this.renderRightContent()}
      </Styled.Container>
    );
  }
}
