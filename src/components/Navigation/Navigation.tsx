import { Vue, Component, Prop } from 'vue-property-decorator';
import * as Styled from './styled';

@Component
export default class Navigation extends Vue {
  @Prop({ required: true }) readonly navigation: App.Navigation[];

  get routePath(): string {
    return this.$route.path;
  }

  redirectPage(link: string): void {
    if (this.routePath !== link) {
      this.$router.push(link);
    }
  }

  getActive(link: string, activeNames: string[] = []): boolean {
    if (activeNames.includes(this.$route.name)) {
      return true;
    }
    return this.routePath === link;
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        {this.navigation.map(
          ({ link, label, activeNames }: App.Navigation, index: number) => {
            const isActive = this.getActive(link, activeNames);
            return (
              <Styled.Navigation
                key={index}
                vOn:click_native={() => this.redirectPage(link)}
                isActive={isActive}
              >
                {label}
              </Styled.Navigation>
            );
          },
        )}
      </Styled.Wrapper>
    );
  }
}
