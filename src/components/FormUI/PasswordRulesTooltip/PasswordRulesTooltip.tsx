import { Vue, Component, Prop } from 'vue-property-decorator';
import * as Styled from './styled';

@Component
export default class PasswordRulesTooltip extends Vue {
  @Prop({ default: 'top-start' }) readonly placement: string;
  @Prop({ default: 'common.password_rules.content' })
  readonly tooltipContent: string;

  render(): JSX.Element {
    return (
      <Styled.InfoIcon placement={this.placement} class="tooltip-container">
        <v-popover
          trigger="hover"
          offset="-20, 12"
          placement={this.placement}
          container=".tooltip-container"
          autoHide
        >
          {this.$slots.content}
          <fragment slot="popover">
            <Styled.TooltipContent>
              {this.$t(this.tooltipContent)}
            </Styled.TooltipContent>
          </fragment>
        </v-popover>
      </Styled.InfoIcon>
    );
  }
}
