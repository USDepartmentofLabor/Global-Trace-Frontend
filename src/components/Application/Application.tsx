import { Vue, Component } from 'vue-property-decorator';
import app from 'store/modules/app';
import { getIcons } from 'utils/app';

@Component({
  head: {
    link() {
      return getIcons();
    },
  },
})
export default class Application extends Vue {
  private logoUrl: string = '';

  created() {
    this.initApp();
  }

  async initApp(): Promise<void> {
    app.getAppLogo({
      callback: {
        onSuccess: (url: string) => {
          this.logoUrl = url;
          this.$emit('updateHead');
        },
      },
    });
  }

  render(): JSX.Element {
    return <router-view></router-view>;
  }
}
