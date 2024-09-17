import { Component, Mixins } from 'vue-property-decorator';
import { SpinLoading } from 'components/Loaders';
import RoleAttributeMixin from './RoleAttributeMixin';

@Component
export default class MyProfile extends Mixins(RoleAttributeMixin) {
  render(): JSX.Element {
    return (
      <fragment>
        {this.isLoading && <SpinLoading isInline={false} />}
        {!this.isLoading && this.renderForm()}
      </fragment>
    );
  }
}
