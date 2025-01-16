import { Vue, Component, Prop } from 'vue-property-decorator';
import Button from 'components/FormUI/Button';
import * as Styled from './styled';

@Component
export default class PartnerList extends Vue {
  @Prop({ default: [] }) readonly partners: Onboard.PartnerOption[];
  @Prop({ default: '' }) readonly title: string;
  @Prop({
    default: () => {
      //
    },
  })
  add: () => void;
  @Prop({
    default: () => {
      //
    },
  })
  remove: (id: string) => void;

  renderList(): JSX.Element {
    return (
      <Styled.List>
        {this.partners.map((partner) => (
          <Styled.ListItem>
            <Styled.Name>{partner.name}</Styled.Name>
            <font-icon
              name="remove"
              size="16"
              color="ghost"
              vOn:click_native={() => this.remove(partner.id)}
            />
          </Styled.ListItem>
        ))}
      </Styled.List>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Container>
        <Styled.Title>{this.title}</Styled.Title>
        {this.renderList()}
        <Styled.Action>
          <Button
            width="100%"
            type="button"
            variant="transparentWarning"
            label={this.$t('add_item', {
              item: this.title,
            })}
            icon="plus"
            click={this.add}
          />
        </Styled.Action>
      </Styled.Container>
    );
  }
}
