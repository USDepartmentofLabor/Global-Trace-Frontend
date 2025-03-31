import { Vue, Component, Prop } from 'vue-property-decorator';
import * as Styled from 'styles/translation-file';
import Button from 'components/FormUI/Button';

@Component
export default class EmptyFile extends Vue {
  @Prop({ required: true })
  downloadProductTemplates: Promise<void>;
  @Prop({ required: true }) downloadAttributesTemplates: Promise<void>;

  render(): JSX.Element {
    return (
      <Styled.Empty>
        <Styled.EmptyImage />
        <Styled.EmptyText>
          {this.$t('upload_product_translations_file_empty_message')}
        </Styled.EmptyText>
        <Styled.EmptyDescription>
          {this.$t('upload_product_translations_file_empty_description')}
        </Styled.EmptyDescription>
        <Styled.Actions>
          <Button
            label={this.$t('product_translation')}
            icon="download"
            variant="outlinePrimary"
            width="248px"
            click={this.downloadProductTemplates}
          />
          <Button
            label={this.$t('product_attribute_translation')}
            icon="download"
            variant="outlinePrimary"
            width="248px"
            click={this.downloadAttributesTemplates}
          />
        </Styled.Actions>
      </Styled.Empty>
    );
  }
}
