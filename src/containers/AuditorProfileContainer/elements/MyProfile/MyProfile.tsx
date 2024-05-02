import { Vue, Component, Prop } from 'vue-property-decorator';
import { getUserFacility } from 'utils/user';
import { getBusinessLocation } from 'utils/helpers';
import Button from 'components/FormUI/Button';
import * as Styled from './styled';

@Component
export default class MyProfile extends Vue {
  @Prop({ required: true }) userInfo: Auth.User;
  @Prop({
    default: () => {
      //TODO
    },
  })
  editProfile: () => void;

  get userFacility(): Auth.Facility {
    return getUserFacility(this.userInfo);
  }

  get businessLocation(): string {
    if (this.userFacility) {
      return getBusinessLocation(this.userFacility);
    }
    return '';
  }

  renderInfo(label: string, value: string): JSX.Element {
    return (
      <Styled.Info>
        <Styled.Label>{label}</Styled.Label>
        <Styled.Text>{value}</Styled.Text>
      </Styled.Info>
    );
  }

  renderContact(): JSX.Element {
    return (
      <Styled.Content>
        <Styled.Title>{this.$t('contact')}</Styled.Title>
        <Styled.Group>
          {this.renderInfo(this.$t('first_name'), this.userInfo.firstName)}
          {this.renderInfo(this.$t('last_name'), this.userInfo.lastName)}
          {this.renderInfo(this.$t('phone'), this.userInfo.phoneNumber)}
          {this.renderInfo(this.$t('email'), this.userInfo.email)}
        </Styled.Group>
        {this.renderInfo(this.$t('password'), '⦁⦁⦁⦁⦁⦁⦁⦁⦁⦁')}
      </Styled.Content>
    );
  }

  renderOrganization(): JSX.Element {
    if (this.userFacility) {
      return (
        <Styled.Content>
          <Styled.Title>{this.$t('organization_details')}</Styled.Title>
          <Styled.Group>
            {this.renderInfo(this.$t('name'), this.userFacility.name)}
            {this.renderInfo(
              this.$t('business_code'),
              this.userFacility.businessRegisterNumber,
            )}
          </Styled.Group>
          {this.renderInfo(this.$t('address'), this.businessLocation)}
        </Styled.Content>
      );
    }
    return null;
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <Styled.Container>
          {this.renderContact()}
          {this.renderOrganization()}
          <Button label={this.$t('edit_profile')} click={this.editProfile} />
        </Styled.Container>
      </Styled.Wrapper>
    );
  }
}
