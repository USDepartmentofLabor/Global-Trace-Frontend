import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';
import { get, noop } from 'lodash';
import {
  getAllCountries,
  getDistrictList,
  getProvinceList,
} from 'api/location';
import store from 'store/index';
import { MODULE } from './constants';

@Module({
  dynamic: true,
  namespaced: true,
  name: MODULE,
  store: store,
})
class Location extends VuexModule implements AppStore.Location {
  public countries: Location.Country[] = [];

  @Action
  async getCountries({ callback }: { callback: App.Callback }): Promise<void> {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);
    try {
      const countries = await getAllCountries();
      this.SET_LIST_COUNTRY(countries);
      onSuccess(countries);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Action
  async getProvinces({
    countryId,
    callback,
  }: {
    countryId: string;
    callback: App.Callback;
  }): Promise<void> {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);
    try {
      const response = await getProvinceList({
        countryId: countryId,
      });
      onSuccess(response);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Action
  async getDistricts({
    provinceId,
    callback,
  }: {
    provinceId: string;
    callback: App.Callback;
  }): Promise<void> {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);
    try {
      const response = await getDistrictList({
        provinceId: provinceId,
      });
      onSuccess(response);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Mutation
  private SET_LIST_COUNTRY(data: Location.Country[]): void {
    this.countries = data;
  }
}

export default getModule(Location);
