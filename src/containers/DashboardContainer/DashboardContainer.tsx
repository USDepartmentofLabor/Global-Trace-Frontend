import { Vue, Component } from 'vue-property-decorator';
import { getHomeRoute } from 'utils/user';

@Component
export default class DashboardContainer extends Vue {
  created(): void {
    if (!this.$route.name) {
      this.$router.push({ name: getHomeRoute() });
    }
  }

  render(): JSX.Element {
    return <router-view></router-view>;
  }
}
