import { Component, Prop, Vue } from 'vue-property-decorator';
import { DEFAULT_ROLE_ICON } from 'config/constants';
import * as Styled from './styled';
import RiskAssessment from './RiskAssessment';

@Component
export default class NodeInformation extends Vue {
  @Prop({ required: true }) supplier:
    | BrandSupplier.SupplierItem
    | BrandSupplier.TraceSupplierMapGroup;
  @Prop({ default: '' }) name: string;
  @Prop({ default: true }) canEdit: boolean;
  @Prop({ default: true }) showRiskAssessment: boolean;
  @Prop({
    default: () => {
      //
    },
  })
  edit: () => void;

  render(): JSX.Element {
    const { label, logo, icon } = this.supplier;
    if (logo) {
      return (
        <Styled.Logo
          domProps={{
            src: logo,
          }}
        />
      );
    }
    return (
      <Styled.NodeBody>
        {this.showRiskAssessment && <RiskAssessment supplier={this.supplier} />}
        <Styled.NodeInformation>
          {label && (
            <Styled.NodeHeader>
              <font-icon
                name={icon || DEFAULT_ROLE_ICON}
                size="14"
                color="manatee"
              />
              <Styled.Label>{label}</Styled.Label>
              {this.canEdit && (
                <Styled.EditIcon class="edit-icon">
                  <font-icon
                    name="edit"
                    size="14"
                    color="envy"
                    vOn:click_native={(e: Event) => {
                      e.stopPropagation();
                      this.edit();
                    }}
                  />
                </Styled.EditIcon>
              )}
            </Styled.NodeHeader>
          )}
          <Styled.Name maxLine={2}>{this.name}</Styled.Name>
        </Styled.NodeInformation>
      </Styled.NodeBody>
    );
  }
}
