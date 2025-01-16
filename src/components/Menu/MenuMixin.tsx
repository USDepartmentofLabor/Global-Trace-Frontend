import { Vue, Component } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import { getFacilityRouters } from 'config/routers/admin-router';
import router from 'config/router';
import { isAuthenticated } from 'utils/cookie';
import { menuList } from 'utils/menu';
import auth from 'store/modules/auth';
import { resetBodyOverFlow } from 'utils/helpers';
import { SignOutTypeEnum } from 'enums/user';

@Component
export default class MenuMixin extends Vue {
  get routeName(): string {
    return this.$route.name;
  }

  get menuList(): App.Menu[] {
    return menuList();
  }

  created() {
    this.updateFacilityRoutes();
  }

  isActiveMenu(menu: App.Menu): boolean {
    return this.routeName === menu.name || menu.active.includes(this.routeName);
  }

  goToSignIn(): void {
    this.$router.push({ name: 'SignIn' });
  }

  updateFacilityRoutes() {
    const allRoutes = router.getRoutes();
    const facilityRouters = getFacilityRouters();
    facilityRouters.forEach((route: RouteConfig) => {
      const facilityRouter = allRoutes.find(({ name }) => route.name === name);
      if (!facilityRouter) {
        router.addRoute(route);
      }
    });
  }

  logout(): void {
    if (!isAuthenticated()) {
      this.goToSignIn();
    } else {
      auth.signOut({
        type: SignOutTypeEnum.SIGN_OUT,
        callback: {
          onSuccess: this.goToSignIn,
        },
      });
    }
    resetBodyOverFlow();
  }
}
