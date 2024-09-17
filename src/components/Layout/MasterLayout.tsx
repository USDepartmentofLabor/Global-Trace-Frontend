import { Component, Vue } from 'vue-property-decorator';
import { ThemeProvider } from 'vue-styled-components';
import theme from 'styles/theme';
import * as Styled from './styled';

@Component
export default class MasterLayout extends Vue {
  render(): JSX.Element {
    return (
      <ThemeProvider theme={theme}>
        <Styled.MasterLayout>{this.$slots.default}</Styled.MasterLayout>
      </ThemeProvider>
    );
  }
}
