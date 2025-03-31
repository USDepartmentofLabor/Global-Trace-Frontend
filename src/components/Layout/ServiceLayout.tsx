import { Vue, Component, Prop } from 'vue-property-decorator';
import MasterLayout from './MasterLayout';
import * as Styled from './styled';

@Component
export default class ServiceLayout extends Vue {
  @Prop({
    default: null,
  })
  title: string;
  render(): JSX.Element {
    return (
      <MasterLayout>
        <Styled.ServiceLayout>
          <Styled.ServiceContainer>
            <Styled.ServiceLogo>
              <Styled.Logo />
            </Styled.ServiceLogo>
            {this.title && (
              <Styled.ServiceTitle>{this.title}</Styled.ServiceTitle>
            )}
            {this.$slots.default}
          </Styled.ServiceContainer>
        </Styled.ServiceLayout>
      </MasterLayout>
    );
  }
}
