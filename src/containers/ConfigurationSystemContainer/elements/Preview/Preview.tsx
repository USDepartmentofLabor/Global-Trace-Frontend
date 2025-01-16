import { Vue, Component, Prop } from 'vue-property-decorator';
import Button from 'components/FormUI/Button';
import { finishConfigurationSystems } from 'api/site-setting';
import { handleError } from 'components/Toast';
import { getUserInfo, setUserInfo } from 'utils/cookie';
import { currentTimestamp } from 'utils/date';
import * as Styled from './styled';

@Component
export default class Preview extends Vue {
  @Prop({
    default: () => {
      //
    },
  })
  finish: () => void;

  async onSubmit(): Promise<void> {
    try {
      await finishConfigurationSystems();
      const userInfo = getUserInfo();
      userInfo.completedConfiguringSystemAt = currentTimestamp();
      setUserInfo(userInfo);
      this.$router.push({ name: 'SuperAdminUserManagement' });
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <Styled.Title>{this.$t('configure_system_title')}</Styled.Title>
        <Styled.Description>
          {this.$t('configure_system_description')}
        </Styled.Description>
        <Styled.Action>
          <Button label={this.$t('configure_system')} click={this.onSubmit} />
        </Styled.Action>
      </Styled.Wrapper>
    );
  }
}
