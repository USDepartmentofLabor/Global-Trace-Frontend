import { Vue, Component, Prop } from 'vue-property-decorator';
import { cloneDeep } from 'lodash';
import { convertEnumToTranslation } from 'utils/translation';
import * as Styled from './styled';
import SelectedAttribute from './SelectedAttribute';

@Component
export default class AttributeGroup extends Vue {
  @Prop({ default: false }) name: string;
  @Prop({ default: false }) data: RoleAndPermission.AttributeParams[];
  @Prop() sort: (attributes: RoleAndPermission.AttributeParams[]) => void;
  @Prop() changeIsOptional: (id: string) => void;
  @Prop() removeAttribute: (id: string) => void;
  private attributes: RoleAndPermission.AttributeParams[] = [];

  created() {
    this.attributes = cloneDeep(this.data);
  }

  handleSort() {
    this.sort(this.attributes);
  }

  remove(attributeId: string): void {
    this.attributes = this.attributes.filter(({ id }) => id !== attributeId);
    this.removeAttribute(attributeId);
  }

  render(): JSX.Element {
    const enumName = convertEnumToTranslation(this.name);
    return (
      <Styled.AttributeGroupWrapper>
        <Styled.GroupTitle>{this.$t(enumName)}</Styled.GroupTitle>
        <Styled.AttributeGroupContent>
          <Styled.AttributeHeader>
            <Styled.AttributeHead>
              {this.$t('attribute_name')}
            </Styled.AttributeHead>
            <Styled.AttributeHead>{this.$t('type')}</Styled.AttributeHead>
          </Styled.AttributeHeader>
          <draggable
            list={this.attributes}
            handle={`.${enumName}`}
            ghost-class="ghost-item"
            vOn:end={this.handleSort}
          >
            {this.attributes.map((attribute) => (
              <Styled.Box key={attribute.id}>
                <SelectedAttribute
                  groupType={this.name}
                  attributeData={attribute}
                  changeIsOptional={() => {
                    attribute.isOptional = !attribute.isOptional;
                    this.changeIsOptional(attribute.id);
                  }}
                  removeAttribute={() => {
                    this.remove(attribute.id);
                  }}
                />
              </Styled.Box>
            ))}
          </draggable>
        </Styled.AttributeGroupContent>
      </Styled.AttributeGroupWrapper>
    );
  }
}
