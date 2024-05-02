import { Vue, Component, Prop } from 'vue-property-decorator';
import { SupplierViewModeEnum } from 'enums/app';
import auth from 'store/modules/auth';
import Button from 'components/FormUI/Button';
import ImportFile from 'components/ImportFile';
import * as Styled from './styled';

@Component
export default class ActionsBar extends Vue {
  @Prop({ default: SupplierViewModeEnum.LIST }) readonly viewMode: string;
  @Prop({ default: false }) readonly isDownloading: boolean;
  @Prop({ required: true }) changeViewMode: (mode: string) => void;
  @Prop({ required: true }) addSupplier: () => void;
  @Prop({ required: true }) downloadTemplate: () => void;
  @Prop({ required: true }) validateFile: () => Promise<void>;

  render(): JSX.Element {
    return (
      <Styled.Container>
        <Styled.Wrapper>
          <Styled.ViewMode
            isActive={this.viewMode == SupplierViewModeEnum.CATEGORY}
            onClick={() => this.changeViewMode(SupplierViewModeEnum.CATEGORY)}
          >
            <font-icon name="category" size="16" />
          </Styled.ViewMode>
          <Styled.ViewMode
            isActive={this.viewMode == SupplierViewModeEnum.LIST}
            onClick={() => this.changeViewMode(SupplierViewModeEnum.LIST)}
          >
            <font-icon name="menu_list" size="16" />
          </Styled.ViewMode>
          {auth.hasManagePartnerMenu && (
            <Styled.Actions>
              <Button
                label={this.$t('add_new_supplier')}
                size="small"
                width="200px"
                click={this.addSupplier}
              />
              <ImportFile validateFile={this.validateFile}>
                <Button
                  label={this.$t('import_new_suppliers')}
                  size="small"
                  width="200px"
                />
              </ImportFile>
              <Button
                label={this.$t('download_template')}
                size="small"
                width="200px"
                isLoading={this.isDownloading}
                disabled={this.isDownloading}
                click={this.downloadTemplate}
              />
            </Styled.Actions>
          )}
        </Styled.Wrapper>
      </Styled.Container>
    );
  }
}
