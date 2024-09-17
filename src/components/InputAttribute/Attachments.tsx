import { Component, Prop, Vue } from 'vue-property-decorator';
import { isUndefined } from 'lodash';
import { getAttributeProperties } from 'utils/product-attributes';
import FileUpload from 'components/FormUI/FileUpload';
import * as Styled from './styled';

@Component
export default class AttributeAttachments extends Vue {
  @Prop({ required: true }) isSubmitting: boolean;
  @Prop({ required: true })
  productAttribute: ProductAttribute.ProductDefinitionAttribute;
  @Prop() change: (params: ProductAttribute.AttributeParams) => void;

  private values: App.UploadFilesResponse[] = [];
  private selectedFiles: App.SelectedFile[] = [];

  get attributeProperties(): ProductAttribute.Entity {
    return getAttributeProperties(this.productAttribute);
  }

  created() {
    if (!isUndefined(this.productAttribute.value)) {
      this.values = this.productAttribute.value;
      this.onChange();
    }
  }

  onChangeFiles(selectedFiles: App.SelectedFile[]): void {
    this.selectedFiles = selectedFiles;
    this.onChange();
  }

  onChangeDefaultFiles(files: App.UploadFilesResponse[]): void {
    this.values = files;
    this.onChange();
  }

  onChange() {
    this.change({
      isOptional: this.attributeProperties.isOptional,
      type: this.attributeProperties.type,
      category: this.attributeProperties.category,
      id: this.attributeProperties.id,
      value: {
        values: this.values,
        selectedFiles: this.selectedFiles.map(({ file }) => file),
      },
    });
  }

  render(): JSX.Element {
    return (
      <Styled.Attribute>
        <Styled.UploadWrapper>
          <FileUpload
            values={this.values}
            inputId={this.attributeProperties.id}
            disabled={this.isSubmitting}
            label={this.attributeProperties.label}
            accept="application/pdf,image/*"
            changeFiles={this.onChangeFiles}
            changeDefaultFiles={this.onChangeDefaultFiles}
          />
        </Styled.UploadWrapper>
      </Styled.Attribute>
    );
  }
}
