import { Vue, Component } from 'vue-property-decorator';
import { isAuthenticated } from 'utils/cookie';
import { getHomeRoute } from 'utils/user';
import Button from 'components/FormUI/Button';
import * as Styled from './styled';

@Component
export default class PageNotFoundContainer extends Vue {
  goHome(): void {
    if (isAuthenticated()) {
      this.$router.push({
        name: getHomeRoute(),
      });
    } else {
      this.$router.push({ name: 'SignIn' });
    }
  }

  render(): JSX.Element {
    return (
      <guest-layout logoSize="large">
        <Styled.Wrapper>
          <Styled.Content>
            <Styled.Img />
            <Styled.LabelContainer>
              <Styled.Label>{this.$t('page_not_found')}</Styled.Label>
            </Styled.LabelContainer>
          </Styled.Content>
          <Styled.Description>
            {this.$t('page_not_found_description')}
          </Styled.Description>
          <Styled.Action>
            <Button
              width="100%"
              type="button"
              label={this.$t('back_to_home')}
              variant="primary"
              click={this.goHome}
            />
          </Styled.Action>
        </Styled.Wrapper>
      </guest-layout>
    );
  }
}
