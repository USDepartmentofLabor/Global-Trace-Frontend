import { Component, Mixins } from 'vue-property-decorator';
import { SpinLoading } from 'components/Loaders';
import RoleAttributeMixin from 'containers/OnboardContainer/elements/MyProfile/RoleAttributeMixin';
import * as Styled from './styled';

@Component
export default class EditProfile extends Mixins(RoleAttributeMixin) {
  render(): JSX.Element {
    return (
      <Styled.Container>
        {this.isLoading && <SpinLoading isInline={false} />}
        {!this.isLoading && this.renderForm(true)}
      </Styled.Container>
    );
  }
}
