import { Component, Prop, Vue } from 'vue-property-decorator';
import { getAttributeProperties } from 'utils/product-attributes';
import FileUpload from 'components/FormUI/FileUpload';
import * as Styled from './styled';

@Component
export default class AttributeAttachments extends Vue {
  @Prop({ required: true }) isSubmitting: boolean;
  @Prop({ required: true })
  productAttribute: ProductAttribute.ProductDefinitionAttribute;
  @Prop() change: (params: ProductAttribute.AttributeParams) => void;

  get attributeProperties(): ProductAttribute.Entity {
    return getAttributeProperties(this.productAttribute);
  }

  onChangeFiles(selectedFiles: App.SelectedFile[]): void {
    this.change({
      isOptional: this.attributeProperties.isOptional,
      type: this.attributeProperties.type,
      category: this.attributeProperties.category,
      id: this.attributeProperties.id,
      value: selectedFiles.map(({ file }) => file),
    });
  }

  render(): JSX.Element {
    return (
      <Styled.Attribute>
        <Styled.UploadWrapper>
          <FileUpload
            inputId={this.attributeProperties.id}
            disabled={this.isSubmitting}
            label={this.attributeProperties.label}
            accept="application/pdf,image/*"
            changeFiles={this.onChangeFiles}
          />
        </Styled.UploadWrapper>
      </Styled.Attribute>
    );
  }
}
