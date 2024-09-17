import i18n from 'i18next';
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';
import { find, get, noop } from 'lodash';
import store from 'store/index';
import { getLocalStorage, setLocalStorage } from 'utils/store';
import { DEFAULT_LANGUAGE } from 'config/constants';
import { getLanguageOptions } from 'utils/helpers';
import { getAppLogo } from 'api/site-setting';

const currentLanguage = getLocalStorage('language');

@Module({
  dynamic: true,
  namespaced: true,
  name: 'app',
  store: store,
})
class App extends VuexModule implements AppStore.AppState {
  public locale: string = currentLanguage || DEFAULT_LANGUAGE;
  public logoUrl: string = '';

  public get currentLanguage(): App.LanguageOption {
    return find(getLanguageOptions(), ({ id }) => id === this.locale);
  }

  @Action
  public async getAppLogo({
    callback,
  }: {
    callback: App.Callback;
  }): Promise<void> {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);

    try {
      if (this.logoUrl) {
        onSuccess(this.logoUrl);
      } else {
        const data = await getAppLogo();
        this.SET_LOGO(data.link);
        onSuccess(data.link);
      }
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Action
  public changeLanguage(language: string): void {
    this.CHANGE_LANGUAGE(language);
  }

  @Mutation
  private SET_LOGO(url: string): void {
    this.logoUrl = url;
  }

  @Mutation
  private CHANGE_LANGUAGE(locale: string): void {
    i18n.changeLanguage(locale);
    setLocalStorage('language', locale);
    this.locale = locale;
  }
}

export default getModule(App);
