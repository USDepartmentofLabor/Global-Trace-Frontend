import { Vue, Component, Prop } from 'vue-property-decorator';
import { get, head } from 'lodash';
import { OarIdEnum, OarIdStatusEnum } from 'enums/onboard';
import appModule from 'store/modules/app';
import Radio from 'components/FormUI/Radio/Radio';
import * as Styled from './styled';

@Component
export default class OAR extends Vue {
  @Prop({
    default: () => {
      //
    },
  })
  changeOarId: (oarId: string) => void;
  @Prop({ default: [] }) oarIdMatches: Onboard.OarIdDetail[];
  @Prop({ required: true }) status: OarIdStatusEnum;

  private oarId: string = null;

  get currentLocale(): string {
    return appModule.locale;
  }

  get isNewFacility(): boolean {
    return this.status === OarIdStatusEnum.NEW_FACILITY;
  }

  get showRadio(): boolean {
    return !this.isNewFacility;
  }

  get hasNotMe(): boolean {
    return (
      this.status == OarIdStatusEnum.POTENTIAL_MATCH ||
      this.status == OarIdStatusEnum.MATCHED
    );
  }

  get notMeText(): string {
    if (this.status === OarIdStatusEnum.POTENTIAL_MATCH) {
      return this.$t('registerOsIdModal.register_use_details_supplied_above');
    }
    return this.$t('registerOsIdModal.enter_new_information');
  }

  get numberOarMatches(): number {
    return this.oarIdMatches.length;
  }

  created(): void {
    this.setOarId(head(this.oarIdMatches).oarId);
  }

  setOarId(value: string): void {
    this.oarId = value;
    this.changeOarId(this.oarId);
  }

  renderNotMe(): JSX.Element {
    return (
      <Styled.Radio vOn:click={() => this.setOarId(OarIdEnum.NOT_ME)} isDefault>
        <Radio
          variant="warning"
          value={this.oarId}
          checkboxValue={OarIdEnum.NOT_ME}
        />
        <Styled.RadioLabel>
          <Styled.Value>
            {this.$t('registerOsIdModal.not_me')}
            <Styled.Text>{this.notMeText}</Styled.Text>
          </Styled.Value>
        </Styled.RadioLabel>
      </Styled.Radio>
    );
  }

  renderList(): JSX.Element {
    return (
      <fragment>
        <Styled.List>
          {this.oarIdMatches.map(({ name, oarId, address, country }) => (
            <Styled.Radio vOn:click={() => this.setOarId(oarId)}>
              {this.showRadio && (
                <Radio
                  variant="warning"
                  value={this.oarId}
                  checkboxValue={oarId}
                />
              )}
              <Styled.RadioLabel>
                <Styled.Label>{this.$t('business_name')}</Styled.Label>
                <Styled.Value>{name}</Styled.Value>
                <Styled.Label>{this.$t('os_id')}</Styled.Label>
                <Styled.Value highlight>{oarId}</Styled.Value>
                <Styled.Label>{this.$t('address')}</Styled.Label>
                <Styled.Value>{address}</Styled.Value>
                <Styled.Label>{this.$t('country')}</Styled.Label>
                <Styled.Value>
                  {get(country, `translation.${this.currentLocale}`, '')}
                </Styled.Value>
              </Styled.RadioLabel>
            </Styled.Radio>
          ))}
          {this.hasNotMe && this.renderNotMe()}
        </Styled.List>
      </fragment>
    );
  }

  newFacilityDescription(): JSX.Element {
    return (
      <Styled.Description>
        {this.$t('registerOsIdModal.new_facility')}
      </Styled.Description>
    );
  }

  renderDescription(): JSX.Element {
    if (this.isNewFacility) {
      return this.newFacilityDescription();
    }
    return (
      <Styled.Description
        domProps={{
          innerHTML: this.$t('registerOsIdModal.content_1', {
            number: this.numberOarMatches,
          }),
        }}
      />
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Content>
        {this.renderDescription()}
        {this.renderList()}
      </Styled.Content>
    );
  }
}
